const imagesController = require('../controller/imageController')

const express = require('express');
const router = express.Router();
/**
 * @swagger
 * /api/v1.0/image/{image_id}:
 *   get:
 *     tags:
 *       - image
 *     summary: Retrieve an image
 *     description: Use this API to retrieve a wallpaper image using its image_id.
 *     parameters:
 *       - in: path
 *         name: image_id
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         required: true
 *         description: The UUID of the image to retrieve.
 *     responses:
 *       200:
 *         description: Image retrieved successfully.
 *       400:
 *         description: Bad Request - Invalid image_id or other issues.
 *       404:
 *         description: Image not found in the database.
 *       500:
 *         description: Server error.
 */
router.get('/image/:image_id', imagesController.getImage)
/**
 * @swagger
 * /api/v1.0/image/{image_id}:
 *   delete:
 *     tags:
 *       - image
 *     summary: delete an image
 *     description: Use this API to delete  image using image_id.
 *     parameters:
 *       - in: path
 *         name: image_id
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         required: true
 *         description: The UUID of the image to retrieve.
 *     responses:
 *       200:
 *         description: Image retrieved successfully.
 *       400:
 *         description: Bad Request - Invalid image_id or other issues.
 *       404:
 *         description: Image not found in the database.
 *       500:
 *         description: Server error.
 */
router.delete('/image/image_id', imagesController.deleteImageController)
module.exports = router