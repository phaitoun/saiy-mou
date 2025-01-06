const wallpaperController = require('../controller/wallpaperController')
const middleware = require('../middleware/authenticateToken')

const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/v1.0/wallpaper:
 *   post:
 *     tags:
 *       - Wallpaper
 *     summary: Use for create wallpaper
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: uuid
 *                 example: "4576cb0a-53ff-4667-a765-c4a80829f9a9"
 *               date_of_birth:
 *                 type: date
 *                 example: "example 2024-09-03T12:34:00Z YYYY-MM-DDTHH:mm:ss.sssZ"
 *               day_of_birth:
 *                  type: string
 *                  example: "example Wednesday"
 *               gender:
 *                 type: string
 *                 example: "male"
 *               name:
 *                 type: string
 *                 example: "example name"
 *               occupation:
 *                 type: string
 *                 example: "example system Architecture"
 *               tel:
 *                 type: string
 *                 example: "2055555555"
 *               gods:
 *                 type: string
 *                 example: "Zeus"
 *
 *     responses:
 *       201:
 *         description: generator wallpaper success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: uuid
 *                   example: "4576cb0a-53ff-4667-a765-c4a80829f9a9"
 *                 name_of_background:
 *                   type: string
 *                   example: "moomu"
 *                 date_of_birth:
 *                   type: date
 *                   example: 1988-07-15T00:00:00.000Z
 *                 gender:
 *                   type: string
 *                   example: "male"
 *                 color:
 *                   type: string
 *                   example: "red"
 *       400:
 *         description: No data provided
 *       500:
 *         description: server error
 */
router.post('/wallpaper',middleware.authenticateToken,wallpaperController.createImages);

/**
 * @swagger
 * /api/v1.0/wallpaper/user/{user_id}:
 *   get:
 *     tags:
 *       - Wallpaper
 *     summary: Use for get all wallpaper by user_id
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "4750878e-2738-4eb5-a54a-a905d98a04e4"
 *         required: true
 *         description: User ID of the users to get all wallpaper
 *
 *     responses:
 *       200:
 *         description: get all wallpaper by user_id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: uuid
 *                   example: "4576cb0a-53ff-4667-a765-c4a80829f9a9"
 *                 name_of_background:
 *                   type: string
 *                   example: "moomu"
 *                 date_of_birth:
 *                   type: date
 *                   example: 1988-07-15T00:00:00.000Z
 *                 gender:
 *                   type: string
 *                   example: "male"
 *                 color:
 *                   type: string
 *                   example: "red"
 *       400:
 *         description: No data provided
 *       404:
 *         description: Data not found
 *       500:
 *         description: server error
 */
router.get('/wallpaper/user/:user_id',middleware.authenticateToken,wallpaperController.getAllWallpaper);

/**
 * @swagger
 * /api/v1.0/wallpaper/{wallpaper_id}:
 *   get:
 *     tags:
 *       - Wallpaper
 *     summary: Use for get wallpaper by wallpaper_id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "id"
 *         required: true
 *         description: wallpaper_id of the wallpaper to get a wallpaper
 *
 *     responses:
 *       200:
 *         description: get wallpaper by wallpaper_id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: uuid
 *                   example: "4576cb0a-53ff-4667-a765-c4a80829f9a9"
 *                 name_of_background:
 *                   type: string
 *                   example: "moomu"
 *                 date_of_birth:
 *                   type: date
 *                   example: 1988-07-15T00:00:00.000Z
 *                 gender:
 *                   type: string
 *                   example: "male"
 *                 color:
 *                   type: string
 *                   example: "red"
 *       400:
 *         description: No data provided
 *       404:
 *         description: Data not found
 *       500:
 *         description: server error
 */
router.get('/wallpaper/:wallpaper_id',middleware.authenticateToken,wallpaperController.getWallpaperById);

/**
 * @swagger
 * /api/v1.0/wallpaper/{wallpaper_id}/{coupon}:
 *   post:
 *     tags:
 *       - Wallpaper
 *     summary: Purchase a wallpaper by its wallpaper_id with an optional coupon
 *     parameters:
 *       - in: path
 *         name: wallpaper_id
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "wallpaper_id"
 *         required: true
 *         description: The ID of the wallpaper to buy
 *       - in: path
 *         name: coupon
 *         schema:
 *           type: string
 *           example: "COUPON123"
 *         required: false
 *         description: The coupon code to apply
 *     responses:
 *       200:
 *         description: Wallpaper purchased successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     buyWallpaper:
 *                       type: object
 *                       properties:
 *                         wallpaper_id:
 *                           type: string
 *                           example: "wallpaper_id"
 *                         paid:
 *                           type: boolean
 *                           example: true
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Buy wallpaper success"
 *       400:
 *         description: Invalid input, such as missing ID
 *       404:
 *         description: Wallpaper not found, or coupon not applicable
 *       500:
 *         description: Server error
 */
router.post('/wallpaper/:id/buy',middleware.authenticateToken, wallpaperController.buyWallpaperById);


/**
 * @swagger
 * /api/v1.0/wallpaper/{wallpaper_id}:
 *   delete:
 *     tags:
 *       - Wallpaper
 *     summary: Use for delete wallpaper by wallpaper_id
 *     parameters:
 *       - in: path
 *         name: wallpaper_id
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "id"
 *         required: true
 *         description: wallpaper_id of the wallpaper to delete a wallpaper
 *
 *     responses:
 *       200:
 *         description: delete success.
 *       400:
 *         description: No data provided
 *       404:
 *         description: Data not found
 *       500:
 *         description: server error
 */
router.delete('/wallpaper/:wallpaper_id',middleware.authenticateToken,wallpaperController.deleteWallpaper);

module.exports = router;    
