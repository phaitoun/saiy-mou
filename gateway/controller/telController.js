const telService = require('../services/telService')
const {
    checkUserByIdService
} = require('../services/loginServices')

const {isValidUUID} = require('../helper/helper')

const createTelephone = async (req, res) => {
    try {
        const {
            user_id,
            tel,
            date_of_birth
        } = req.body;
        if (!user_id || !tel || !date_of_birth) {
            return res.status(400).json({
                message: "Invalid input"
            });
        }
        if(!isValidUUID(user_id)){
            return res.status(400).json({
                success: false,
                message: "invalid format uuid"
            })
        }

        const isCheckUser = await checkUserByIdService(user_id)

        if(!isCheckUser){
            return res.status(400).json({
                success: false,
                message: "user not found"
            })
        }

        const generateData ={
            user_id,
            tel,
            date_of_birth
        }
        const telephone = await telService.createTelephone(generateData);
        if (!telephone) {
            return res.status(400).json({
                message: 'Create not success',
                success: false
            });
        } else {
            return res.status(201).json({
                data: {
                    telephone: telephone
                },
                message: 'Create success',
                success: true
            });
        }
    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            message: error.message
        })
    }
};


const getAllTelephone = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        if (!user_id) {
            return res.status(400).json({
                message: "Invalid input"
            });
        }

        const telephone = await telService.getAllTelephone(user_id)
        if (telephone.length == 0) {
            return res.status(404).json({
                message: 'user_id not found',
                success: false
            });
        } else {
            return res.status(200).json({
                data: {
                    telephone: telephone
                },
                success: true,
                message: "Get telephones success"
            });
        }
    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            message: error.message
        })
    }

};


const getTelephoneById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                message: "Invalid input"
            });
        }

        if (!isValidUUID(id)) {
            return res.status(400).json({
                success: false,
                message: "invalid format uuid"
            })
        }

        const telephone = await telService.getTelephoneById(id)
        if (!telephone) {
            return res.status(404).json({
                message: 'data not found',
                success: false
            });
        } else {
            return res.status(200).json({
                data: {
                    telephone: telephone
                },
                success: true,
                message: "Get telephone success"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
};


const deleteTelephone = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({
                message: "Invalid input"
            });
        }

        if (!isValidUUID(id)) {
            return res.status(400).json({
                success: false,
                message: "invalid format uuid"
            })
        }

        const isCheckTelephone = await telService.getTelephoneById(id);

        if (!isCheckTelephone) {
            return res.status(404).json({
                success: false,
                message: "id not found"
            })
        }
        await telService.deleteTelephone(id)
        return res.status(200).json({
            message: 'Delete success',
            success: true
        });
        
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }

};


module.exports = {
    createTelephone,
    getAllTelephone,
    getTelephoneById,
    deleteTelephone,
};