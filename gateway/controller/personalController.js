const personalService = require('../services/personalService')
require('dotenv').config();
const {
    checkUserByIdService
} = require('../services/loginServices')
const {
    isValidUUID
} = require('../helper/helper.js')
const {
    hash,
} = require('bcrypt')


const createNewPersonal = async (req, res) => {
    const {
        name,
        gender,
        password,
        date_of_birth,
        phone_number,
        occupation,
        relationship_status,
        user_id
    } = req.body;

    let bodyData = {
        name: name,
        password: password,
        gender: gender,
        date_of_birth: date_of_birth,
        phone_number: String(phone_number),
        occupation: occupation,
        relationship_status: relationship_status,
        user_id: user_id
    }
    try {
        if (!isValidUUID(bodyData.user_id)) {
            return res.status(400).json({
                message: "very bad request🙅‍♂️"
            })
        }
        if (!bodyData.name || !bodyData.gender || !bodyData.date_of_birth || !bodyData.phone_number || !bodyData.occupation || !bodyData.relationship_status || !bodyData.user_id || !bodyData.password) {
            return res.status(400).json({
                message: "Invalid input"
            });
        }

        const isCheckUser = await checkUserByIdService(bodyData.user_id);

        if (!isCheckUser) {
            return res.status(400).json({
                message: "invalid input"
            })
        }

        const findUser = await personalService.findUserById(isCheckUser.user_id)

        if (findUser) {
            return res.status(400).json({
                success: false,
                message: "exist user"
            })
        }
        const saltRounds = parseInt(process.env.SALT_ROUNDS)
        //hash password
        const hashedPassword = await hash(password, saltRounds);
        bodyData.password = hashedPassword

        const personal = await personalService.createNewPersonal(bodyData);
        if (!personal) {
            return res.status(400).json({
                message: 'Create person is not success or something went wrong',
                success: false
            });
        }
        return res.status(201).json({
            data: {
                personal: personal
            },
            message: 'Create success',
            success: true
        });

    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            message: "server error"
        })
    }
};


const getPersonalByUserId = async (req, res) => {
    try {
        const id = req.params.user_id
        
        if (!id) {
            return res.status(400).json({
                message: "uuid must be provide"
            });
        }
        if (!isValidUUID(id)) {
            return res.status(400).json({
                message: "uuid is not collect"
            })
        }

        const isCheckUser = await checkUserByIdService(id)

        if (!isCheckUser) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            })
        }
        const personal = await personalService.getPersonalByUserId(id)
        if (!personal) {
            return res.status(404).json({
                message: 'data not found',
                success: false
            });
        }
        return res.status(200).json({
            data: {
                personal: personal
            },
            success: true,
            message: "Get a personal success"
        });

    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            message: "server error"
        })
    }
};


const updatePersonal = async (req, res) => {
    const personal_id = req.params.personal_id
    

    const {
        name,
        gender,
        date_of_birth,
        phone_number,
        occupation,
        relationship_status,
        user_id
    } = req.body;

    let bodyData = {
        name: name,
        gender: gender,
        date_of_birth: date_of_birth,
        phone_number: String(phone_number),
        occupation: occupation,
        relationship_status: relationship_status,
        user_id: user_id
    }

    console.log(bodyData);
    
    try {

        if (!bodyData.name || !bodyData.gender || !bodyData.date_of_birth || !bodyData.phone_number || !bodyData.occupation || !bodyData.relationship_status || !bodyData.user_id) {
            return res.status(400).json({
                message: "Invalid input"
            });
        }

        if (!isValidUUID(personal_id) || !isValidUUID(bodyData.user_id)) {
            return res.status(400).json({
                message: "invalid uuid format🙅‍♂️"
            })
        }

        const existUser = await personalService.getPersonalById(personal_id)

        if (!existUser) {
            return res.status(404).json({
                success: false,
                message: "not found data",
            })
        }

        
        bodyData.password = existUser.password


        await personalService.updatePersonal(personal_id, bodyData)


        return res.status(200).json({
            success: true,
            message: "Update a personal success"
        });

    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            message: "server error"
        })
    }
};


const deletePersonal = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({
                message: "Bad Request: No data provided"
            });
        }

        const existUser = await personalService.getPersonalById(id)

        if (!existUser) {
            return res.status(404).json({
                success: false,
                message: "not found data",
                data: {}
            })
        }
        await personalService.deletePersonal(id)

        return res.status(200).json({
            message: 'Delete success',
            success: true
        });

    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            message: "server error"
        })
    }

};

const getPersonalById = async (req, res) => {
    try {

        const id = req.params.id

        if (!id) {
            return res.status(400).json({
                message: "Bad Request: No data provided",
                success: false
            });
        }
        const response = await personalService.getPersonalById(id)
        if (!response) {
            return res.status(404).json({
                success: false,
                message: "not found",
                data: {}
            })
        }
        return res.status(200).json({
            success: true,
            message: "query success",
            data: response
        })
    } catch (err) {
        console.log("controller error", err);
        res.status(500).json({
            message: "server error"
        })

    }
}
module.exports = {
    createNewPersonal,
    getPersonalByUserId,
    updatePersonal,
    deletePersonal,
    getPersonalById
};