const app = require('..');
const {
    getStarByIdController,
    getLogoByIdController
} = require('../controller/zodiacImageController')
const middleware = require("../middleware/authenticateToken")
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/v1.0/star-zodiac/{zodiac_image_id}:
 *   get:
 *     tags:
 *       - image
 *     summary: Retrieve an image start zodiac
 *     description: Use this API to retrieve a image star zodiac zodiac_image_id
 *     parameters:
 *       - in: path
 *         name: zodiac_image_id
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
 *         description: Bad Request - Invalid zodiac_image_id or other issues.
 *       404:
 *         description: Image not found in the database.
 *       500:
 *         description: Server error.
 */
router.get('/star-zodiac/:zodiac_image_id', getStarByIdController)

/**
 * @swagger
 * /api/v1.0/logo-zodiac/{zodiac_image_id}:
 *   get:
 *     tags:
 *       - image
 *     summary: Retrieve an image logo zodiac
 *     description: Use this API to retrieve a image logo zodiac zodiac_image_id
 *     parameters:
 *       - in: path
 *         name: zodiac_image_id
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
 *         description: Bad Request - Invalid zodiac_image_id or other issues.
 *       404:
 *         description: Image not found in the database.
 *       500:
 *         description: Server error.
 */
router.get('/logo-zodiac/:zodiac_image_id', getLogoByIdController)

module.exports = router