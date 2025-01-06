const wallpaperService = require('../services/wallpaperService')
const axios = require('axios');
const {
    getPersonalByUserId
} = require('../services/personalService')
const {
    isValidUUID
} = require('../helper/helper')
const {
    deleteImageByIdService,

} = require('../services/imageService')

const {
    generateImageService
} = require('../services/imageService')
const couponService = require('../services/couponService');
const url = "http://127.0.0.1:5000/generate"

//request image in model 
const createWallpaper = async (req, res) => {
    try {
        const {
            user_id,
            date_of_birth,
            day_of_birth,
            name,
            tel,
            gender,
            gods,
            occupation,
            token
        } = req.body;

        if (!user_id || !date_of_birth || !day_of_birth || !name || !tel || !gender || !gods || !occupation) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const checkUser = await getPersonalByUserId(user_id);

        if (!checkUser) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        let bodyData = {
            user_id,
            date_of_birth,
            day_of_birth,
            name,
            tel,
            gender,
            gods,
            occupation,
            price: 50000,
            paid: false
        }
        //send data to generate image return image_id
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }

        const prompt = {
            prompt: `Generate a detailed and vibrant horoscope-themed image for a male named ${bodyData.name},
                     who is a ${bodyData.occupation}. The image should reflect the astrological characteristics associated 
                     with his birth date of ${bodyData.date_of_birth}, which was a ${bodyData.day_of_birth}. Include elements related to his belief
                     in ${bodyData.gods} and his professional background as a ${bodyData.occupation}. The overall design should integrate both 
                     astrological symbols and symbols of ${bodyData.gods} to represent his spiritual and professional identity`
        }
        try {

            const responseFromModel = await axios.post(`${url}`, prompt, config);

            if (!responseFromModel) {
                return res.status(500).json({
                    success: false,
                    message: `generate image error or something went wrong`
                })
            }

            bodyData.image_id = responseFromModel.data.image_id
        } catch (error) {
            console.log("error in generate image create wallpaper controller", error);
            return res.status(500).json({
                success: false,
                message: "something went wrong with generate image"
            })
        }
        const wallpaper = await wallpaperService.createWallpaper(bodyData);
        if (!wallpaper) {
            return res.status(400).json({
                message: 'Create not success',
                success: false
            });
        }
        return res.status(201).json({
            data: {
                wallpaper: wallpaper
            },
            message: 'Create success',
            success: true
        });


    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            message: error.message
        })
    }
};

const getAllWallpaper = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        if (!user_id) {
            return res.status(400).json({
                message: "user_id is required"
            });
        }

        const wallpaper = await wallpaperService.getAllWallpaper(user_id)
        if (wallpaper.length == 0) {
            return res.status(404).json({
                message: 'data not found',
                success: false
            });
        } else {
            return res.status(200).json({
                data: {
                    wallpaper: wallpaper
                },
                success: true,
                message: "Get data success"
            });
        }
    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            message: error.message
        })
    }
};


const getWallpaperById = async (req, res) => {
    try {
        const wallpaper_id = req.params.wallpaper_id;
        if (!wallpaper_id) {
            return res.status(400).json({
                message: "id is required"
            });
        }

        const wallpaper = await wallpaperService.getWallpaperById(wallpaper_id)
        if (!wallpaper) {
            return res.status(404).json({
                message: 'id not found',
                success: false
            });
        } else {
            return res.status(200).json({
                data: {
                    wallpaper: wallpaper
                },
                success: true,
                message: "Get data success"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
};


const buyWallpaperById = async (req, res) => {
    const {
        id,
        coupon
    } = req.params;

    try {
        if (!id) {
            return res.status(400).json({
                message: "ID is required"
            });
        }

        let couponCode;
        if (coupon) {
            couponCode = await couponService.getCouponByCode(coupon);
            if (!couponCode) {
                return res.status(404).json({
                    message: "Invalid or expired coupon code",
                    success: false
                });
            }
        }

        const data = {
            id: id,
            discount: couponCode ? couponCode.discount : 0
        };

        const buyWallpaper = await wallpaperService.buyWallpaperById(data);

        if (!buyWallpaper.status) {
            return res.status(404).json({
                message: buyWallpaper.message,
                success: false
            });
        } else {
            return res.status(200).json({
                data: buyWallpaper.data,
                success: true,
                message: buyWallpaper.message
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};



const deleteWallpaper = async (req, res) => {
    try {
        const wallpaper_id = req.params.wallpaper_id
        if (!wallpaper_id) {
            return res.status(400).json({
                message: "No data provided"
            });
        }

        const wallpaper = await wallpaperService.deleteWallpaper(wallpaper_id)
        if (!wallpaper) {
            return res.status(404).json({
                message: 'id not found',
                success: false
            });
        }
        await deleteImageByIdService(wallpaper.image_id);
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

const createImages = async (req, res) => {
    try {

        const {
            user_id,
            date_of_birth,
            day_of_birth,
            name,
            tel,
            gender,
            gods,
            occupation,
        } = req.body;

        if (!user_id || !date_of_birth || !day_of_birth || !name || !tel || !gender || !gods || !occupation) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const checkUser = await getPersonalByUserId(user_id);

        if (!checkUser) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        let userData = {
            user_id,
            date_of_birth,
            day_of_birth,
            name,
            tel: String(tel),
            gender,
            gods,
            occupation,
            price: 50000,
            paid: false
        }
        const prompt = {
            prompt: `Generate a detailed and vibrant horoscope-themed image for a male named ${userData.name},theme galaxy,
                     who is a ${userData.occupation}. The image should reflect the astrological characteristics associated 
                     with his birth date of ${userData.date_of_birth}, which was a ${userData.day_of_birth}. Include elements related to his belief
                     in ${userData.gods} and his professional background as a ${userData.occupation}. The overall design should integrate both 
                     astrological symbols and symbols of ${userData.gods} to represent his spiritual and professional identity`
        }

        const binaryImage = await generateImageService(prompt, userData)


        const imageBuffer = Buffer.from(binaryImage.image_file); // assuming the image is stored as a binary blob

        // Set headers to prompt the browser to download the image
        // res.setHeader('Content-Disposition', `attachment; filename=${id}.png`);
        res.setHeader('Content-Type', 'image/png');

        return res.status(200).send(imageBuffer)
    } catch (error) {
        console.log(error);
        return res.status(500).json("server error")

    }
}

module.exports = {
    createWallpaper,
    getAllWallpaper,
    getWallpaperById,
    buyWallpaperById,
    deleteWallpaper,
    createImages
};