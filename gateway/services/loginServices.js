const prisma = require("../utils/prisma.js");

const storeOtp = async (otpData) => {

    try {
        const addOtp = await prisma.$transaction(async (tx) => {
            try {

                const addOtpCode = await tx.otp_codes.create({
                    data: {
                        email: otpData.email,
                        otp_code: otpData.hashedOtp,
                        expires_at: new Date(Date.now() + 5 * 60000) // Expires in 5 minutes
                    }
                });
                return addOtpCode;
            } catch (error) {
                console.log("error in transaction store otp to db ", error);

            }

        })

        if (!addOtp) {
            return false;
        }
        return addOtp;
    } catch (error) {
        console.error("service register error: ", error)
        throw error;
    }

};
const checkUserByEmail = async (userData) => {
    
    try {
        const findUser = await prisma.users.findFirst({
            where: {
                email: userData.email
            }
        });

        if (!findUser) {
            return false;
        }

        return findUser;

    } catch (error) {
        console.error("Error in loginUser service: ", error);
        throw error;
    }
};
const registerUser = async (userData) => {
    try {

        const response = await prisma.$transaction(async tx => {
            try {

                const result = await tx.users.create({
                    data: {
                        email: userData.email,

                    }
                });

                return result;
            } catch (error) {

                throw error;
            }
        });

        return response;
    } catch (error) {
        console.log(error);

        throw new Error("service register user error :", error)
    }
};
const updatePassword = async (userData) => {
    try {

        const response = await prisma.$transaction(async tx => {

            try {
                const result = await tx.personal.update({
                    where: {
                        personal_id: userData.personal_id

                    },
                    data: {
                        password: userData.password,
                    }
                });
                return result;

            } catch (error) {
                throw error;
            }
        });
        return response;

    } catch (error) {
        console.log(error);

        throw new Error("service update user error :", error)

    }
};

const deleteRefreshToken = async (refreshToken) => {

    try {

        const response = await prisma.$transaction(async tx => {
            try {

                const result = await tx.tokens.delete({
                    where: {
                        token: refreshToken
                    },

                })
                return result

            } catch (err) {
                throw err
            }
        });

        return response
    } catch (err) {
        throw err
    }
}

const saveRefreshToken = async (id, refreshToken) => {
    try {

        const response = await prisma.$transaction(async (tx) => {
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days expiry
            const result = await tx.tokens.create({
                data: {
                    user_id: id,
                    token: refreshToken,
                    expires_at: expiresAt,
                }
            });
            return result;
        });
        return response;
    } catch (err) {
        throw err;
    }
};

const checkUserByIdService = async (user_id) => {
    try {
        const response = prisma.users.findFirst({
            where: {
                user_id: user_id
            }
        })
        return response
    } catch (error) {
        throw error
    }
}

const findUserPersonal = async (user_id) => {
    try {

        const response = prisma.personal.findFirst({
            where: {
                user_id: user_id
            }
        })
        return response
    } catch (error) {
        throw error
    }

}
module.exports = {
    storeOtp,
    checkUserByEmail,
    registerUser,
    updatePassword,
    deleteRefreshToken,
    saveRefreshToken,
    checkUserByIdService,
    findUserPersonal
}