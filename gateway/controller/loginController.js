const loginServices = require('../services/loginServices')
const personalService = require('../services/personalService.js')
const prisma = require("../utils/prisma.js");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const {
  createAccessToken,
  createRefreshToken,
  checkEmail
} = require('../helper/helper.js')

const {
  hash,
  compare,
} = require('bcrypt')

const mail = require('../utils/mailSender')

const sendOtp = async (req, res) => {

  const {
    email
  } = req.body;
  if (!email) {

    return res.status(422).json({
      message: {
        email: "Email is required",
      },
      success: false
    });

  }
  if (!checkEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid format"
    })
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  const saltRounds = parseInt(process.env.SALT_ROUNDS)

  const hashedOtp = await hash(otp.toString(), saltRounds);


  await mail.mailSender(email,
    "Verification Email",
    `<h1>Please confirm your OTP </h1>
             <p> here is your OTP code:-> ${otp} </p>
            `
  );

  const otpData = {
    email: email,
    hashedOtp: hashedOtp,
  }

  try {

    const response = await loginServices.storeOtp(otpData)

    if (!response) {
      throw error
    }
    return res.status(200).json(({
      message: `send otp success`,
      success: true,
    }));

  } catch (error) {
    console.error("---------------", error);
    res.status(500).json({
      error: error
    });
  }

};
const loginUser = async (req, res) => {
  const {
    email,
    password
  } = req.body;

  if (!email || !password) {
    return res.status(422).json({

      message: "Email or password is required",
      success: false,

    });
  };

  try {

    if (!checkEmail(email)) {
      return res.status(400).json({
        message: "Must be a valid email",
        success: false
      })
    }
    const userData = {
      email: email,
      password: password
    }



    const userFound = await loginServices.checkUserByEmail(userData);

    if (!userFound) {
      return res.status(403).json({
        message: "Invalid login credentials",
        success: false
      });
    }

    const findPersonal = await personalService.findUserById(userFound.user_id)

    if (!findPersonal) {


      return res.status(403).json({
        message: "Email or Password is not valid",
        success: false
      });
    }

    const match = await compare(userData.password, findPersonal.password);

    
    if (!match) {

      return res.status(403).json({
        message: "Email or Password is not valid",
        success: false

      });
    }

    const accessToken = createAccessToken(userFound.user_id);

    const refreshToken = createRefreshToken(userFound.user_id)

    await loginServices.saveRefreshToken(userFound.user_id, refreshToken)

    return res.status(200).json({
      message: "user login successfully",
      success: true,
      data: {
        user_id: userFound.user_id,
        accessToken: accessToken,
        refreshToken: refreshToken
      }
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `server error `,
      success: false
    });
  }

};

const refreshToken = async (req, res) => {
  try {

    const {
      refreshToken
    } = req.body;

    if (!refreshToken) return res.sendStatus(401);

    const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

    if (!decode) {
      return res.sendStatus(403)
    }

    //check if token exists in database and not revoked
    const isCheckUser = await prisma.tokens.findFirst({
      where: {
        token: refreshToken
      }
    })
    if (!isCheckUser) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or revoked refresh token'
      })
    }

    //delete old refresh token 
    await loginServices.deleteRefreshToken(refreshToken)

    //new tokens
    const accessToken = createAccessToken({
      user_id: isCheckUser.user_id
    })
    const newRefreshToken = createRefreshToken({
      user_id: isCheckUser.user_id
    })

    await loginServices.saveRefreshToken(isCheckUser.user_id, newRefreshToken)


    return res.status(200).json({
      message: "refresh token success",
      success: true,
      data: {
        user_id: isCheckUser.user_id,
        accessToken: accessToken,
        refreshToken: newRefreshToken
      }
    })


  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "server error"
    })

  }
};
const registerUser = async (req, res) => {
  try {
    const {
      email,
      OTP
    } = req.body;

    const reqData = {
      email,
      OTP
    }

    if (!reqData.email || !reqData.OTP) {
      return res.status(400).json({
        success: false,
        message: "please fill data"
      })
    }
    const storeOtp = await prisma.otp_codes.findFirst({
      where: {
        email: email
      },
      orderBy: {
        created_at: 'desc',
      },
    });


    if (!storeOtp || new Date().getTime() > new Date(storeOtp.expires_at).getTime()) {
      return res.status(400).json({

        message: "OTP is invalid or expire",
        success: false,
      })
    };


    const isOtpValid = await compare(OTP, storeOtp.otp_code);


    if (!isOtpValid) {
      return res.status(400).json({

        message: "Invalid OTP",
        success: false,
        data: {}
      });
    };

    const userData = {
      email: email

    };

    const checkUser = await loginServices.checkUserByEmail(userData);
    if (checkUser) {
      return res.status(400).json({
        success: false,
        message: "exist user",
      })
    }
    const response = await loginServices.registerUser(userData);


    const accessToken = createAccessToken(response.user_id);

    const refreshToken = createRefreshToken(response.user_id)

    res.status(201).json({

      message: "user created successfully",
      success: true,
      data: {
        user: response,
        accessToken: accessToken,
      }
    })
  } catch (error) {

    console.log(error);
    return res.status(500).json({

      message: `server error: ${error}`,
      success: false,
      data: {}
    });
  }

};

const forgotPassword = async (req, res) => {

  const {
    email,
    password,
    OTP
  } = req.body;


  try {
    let userData = {
      email: email,
    };

    const userFound = await loginServices.checkUserByEmail(userData);

    if (!userFound) {
      return res.status(404).json({
        success: false,
        message: "user not found please register first",
        data: {}
      });
    };

    const storeOtp = await prisma.otp_codes.findFirst({
      where: {
        email: email
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    if (!storeOtp || new Date().getTime() > new Date(storeOtp.expires_at).getTime()) {
      return res.status(400).json({

        message: "OTP is invalid or expire",
        success: false,
        data: {}
      });
    };

    const isOtpValid = await compare(OTP, storeOtp.otp_code);


    if (!isOtpValid) {
      return res.status(400).json({

        message: "Invalid OTP",
        success: false,
        data: {}

      });
    };
    const saltRounds = parseInt(process.env.SALT_ROUNDS)
    const hashedPassword = await hash(password, saltRounds);


    const userInfo = await loginServices.findUserPersonal(userFound.user_id)

    userData = {

      password: hashedPassword,
      personal_id: userInfo.personal_id
    };

    const result = await loginServices.updatePassword(userData);

    if (!result) {
      return res.status(500).json({
        message: `server error while update user`,
        success: false,
        data: {}

      });

    }

    return res.status(200).json({
      message: "user is update successfully",
      success: true,
      data: {
        user: result
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "server error",
      success: false,
      data: {}
    })
  }




};




//clear otp 
const clearOtp = async () => {

  try {
      const personal = await prisma.$transaction(async tx => {
          try {
              // Get the current time and subtract 5 hours
              const fiveHoursAgo = new Date(Date.now() - 1 * 60 * 60 * 1000);

              const result = await tx.otp_codes.deleteMany({
                  where: {
                      expires_at: {
                          lt: fiveHoursAgo // less than 5 hours before current time
                      }
                  },
              });

              return result
          } catch (error) {
              console.log("service error while clear OTP code ");

              throw error
          }
      })

      return personal;
  } catch (error) {
      console.error("Service error cron job work:");
      throw error
  }
}

module.exports = {
  sendOtp,
  loginUser,
  registerUser,
  forgotPassword,
  refreshToken,
  clearOtp
};