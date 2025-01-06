const {
    getImageService,
    generateImageService,
    deleteImageByidService
} = require('../services/imageService')

const {
    isValidUUID
} = require('../helper/helper.js')
const sharp = require('sharp');
const {
    head
} = require('../routes/wallpaper.js');
const getImage = async (req, res) => {
    const image_id = req.params.image_id;
    const {
        width,
        height
    } = req.body;

    try {
        if (!isValidUUID(image_id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid UUID format"
            });
        }

        const response = await getImageService(image_id);
        if (!response) {
            return res.status(404).json({
                error: 'Image not found or invalid UUID'
            });
        }

        const imageBuffer = Buffer.from(response.image_file); // assuming the image is stored as a binary blob

        let finalImageBuffer;

        if (width !== undefined || height !== undefined) {
            // Resize the image
            finalImageBuffer = await sharp(imageBuffer)
                .resize({
                    width: parseInt(width, 10),
                    height: parseInt(height, 10),
                    fit: 'cover',
                    position: 'centre'
                })
                .toBuffer();
        } else {

            finalImageBuffer = imageBuffer;
        }

        res.setHeader('Content-Type', 'image/png');

        // Send the image buffer as the response    
       return res.send(finalImageBuffer);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};

const deleteImageController = async (req, res) => {
    const image_id = req.params.image_id
    try {

        if (!image_id) {
            return res.status(400).json({
                success: false,
                message: "image_id is require"
            })
        }
        if (!isValidUUID(image_id)) {
            return res.status(400).json({
                success: false,
                message: "invalid format uuid"
            })
        }
        await deleteImageByidService(image_id);
        return res.status(200).json({
            success: true,
            message: "delete images is successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "server error"
        })
    }
}
module.exports = {
    deleteImageController,
    getImage
}