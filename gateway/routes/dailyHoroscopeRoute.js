const dailyHoroscopeController = require('../controller/dailyHoroscopeController')
const middleware = require("../middleware/authenticateToken")
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/v1.0/daily-horoscope:
 *   post:
 *     tags:
 *       - daily horoscope
 *     summary: create new horoscope daily this api run by cron job everyweek don't has route
 *     description: this api create new horoscope daily in date of week

 *     responses:
 *       200:
 *         description: OTP sent successfully to the provided email.
 *       400:
 *         description: Bad Request - Invalid email or other issues.
 *       404:
 *         description: don't have any data in database 
 *       500:
 *         description: server error
 */
router.post("/daily-horoscope", middleware.authenticateToken ,dailyHoroscopeController.create);


/**
 * @swagger
 * /api/v1.0/daily-horoscope:
 *   get:
 *     tags:
 *       - daily horoscope
 *     summary: query all data in daily horoscope
 *     description: this api get all data in horoscope daily in date of week
 *    
 *     responses:
 *       200:
 *         description: OTP sent successfully to the provided email.
 *       400:
 *         description: Bad Request - Invalid email or other issues.
 *       404:
 *         description: not found.
 *       500:
 *         description: server error
 */
router.get("/daily-horoscope", middleware.authenticateToken ,dailyHoroscopeController.getAll);
/**
 * @swagger
 * /api/v1.0/daily-horoscope/{id}:
 *   get:
 *     tags:
 *       - daily horoscope
 *     summary: Query by ID in daily horoscope
 *     description: This API retrieves all horoscope data by ID for a specific day of the week.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the horoscope entry to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Horoscope data retrieved successfully.
 *       400:
 *         description: Bad Request - Invalid ID or other issues.
 *       500:
 *         description: Server error.
 */
router.get("/daily-horoscope/:id",middleware.authenticateToken,dailyHoroscopeController.getById);
/**
 * @swagger
 * /api/v1.0/daily-horoscope/{id}:
 *   put:
 *     tags:
 *       - daily horoscope
 *     summary: update by ID in daily horoscope
 *     description: This API update by field id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the horoscope entry to retrieve
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               week_day:
 *                 type: string
 *                 example: "example Monday"
 *               lucky_number:
 *                 type: object
 *                 example: 123456
 *               lucky_color:
 *                 type: string
 *                 example: "red"
 *               description_love:
 *                 type: string
 *                 example: "example :everybody love your girl friend without you 😂 except you did't have a girl friend"
 *               description_health:
 *                 type: string
 *                 example: "example :you will have a accident is cheers🍻 "
 *               description_money:
 *                 type: string
 *                 example: "example : you will fall in love with money 🫶"
 *               start_date:
 *                 type: string
 *                 example: "2024-08-26T00:00:00+07:00"
 *               end_date:
 *                 type: string
 *                 example: "2024-08-26T00:00:00+07:00"
 *     responses:
 *       200:
 *         description: Horoscope data retrieved successfully.
 *       400:
 *         description: Bad Request - Invalid ID or other issues.
 *       500:
 *         description: Server error.
 */
router.put("/daily-horoscope/:id",middleware.authenticateToken ,dailyHoroscopeController.update);
/**
 * @swagger
 * /api/v1.0/daily-horoscope/{id}:
 *   delete:
 *     tags:
 *       - daily horoscope
 *     summary: delete by ID in daily horoscope
 *     description: This API delete horoscope data by ID for a specific day of the week.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the horoscope 
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Horoscope delete successfully.
 *       400:
 *         description: Bad Request - Invalid ID or other issues.
 *       500:
 *         description: Server error.
 */
router.delete("/daily-horoscope/:id",middleware.authenticateToken ,dailyHoroscopeController.deleteDailyHoroscope);

module.exports = router;