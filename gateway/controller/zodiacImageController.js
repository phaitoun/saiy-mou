const {
    getById
} = require('../services/zodiacImageService')

const getLogoByIdController = async (req, res) => {
    try {

        const zodiac_image_id = req.params.zodiac_image_id;
        if (!zodiac_image_id) {
            return res.status(400).json({
                success: false,
                message: "id not found"
            })
    
        }
        const getImageByte = await getById(zodiac_image_id)
        const imageBuffer = Buffer.from(getImageByte.zodiac_logo);
    
        res.setHeader('Content-Type', 'image/png');
    
        // Send the image buffer as the response    
        return res.send(imageBuffer);
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "server error "
        })
    }

}

const getStarByIdController = async (req, res) => {
    try {

        const zodiac_image_id = req.params.zodiac_image_id;
       
        
        if (!zodiac_image_id) {
            return res.status(400).json({
                success: false,
                message: "id not found"
            })
    
        }
        const getImageByte = await getById(zodiac_image_id)
        const imageBuffer = Buffer.from(getImageByte.star_zodiac);
    
        res.setHeader('Content-Type', 'image/png');
    
        // Send the image buffer as the response    
        return res.send(imageBuffer);
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "server error "
        })
    }

}
module.exports = {
    getLogoByIdController,
    getStarByIdController
}