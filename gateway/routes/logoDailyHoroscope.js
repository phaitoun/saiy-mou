const app = require('..');
const {
    getLoGoByIdController
} = require('../controller/logo_dailyHoroScopeController')
const middleware = require("../middleware/authenticateToken")
const express = require('express');
const router = express.Router();


/**
 * @swagger
 * /api/v1.0/getLogoDaily/{logo_daily_id}:
 *   get:
 *     tags:
 *       - image
 *     summary: Retrieve an image
 *     description: Use this API to retrieve a wallpaper image using its logo_daily_id.
 *     parameters:
 *       - in: path
 *         name: logo_daily_id
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
 *         description: Bad Request - Invalid logo_daily_id or other issues.
 *       404:
 *         description: Image not found in the database.
 *       500:
 *         description: Server error.
 */
router.get('/getLogoDaily/:logo_daily_id',getLoGoByIdController)

module.exports = router;
