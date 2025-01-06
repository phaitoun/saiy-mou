const zodiacController = require('../controller/zodiacController')
const middleware = require('../middleware/authenticateToken')
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/v1.0/zodiac-per-day:
 *   post:
 *     tags:
 *       - zodiac
 *     summary: create new zodiac this api run by cron job everyday don't has route
 *     description: this api create new zodiac in day

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
router.post('/zodiac-per-day', middleware.authenticateToken, (req, res) => zodiacController.createZodiac(1, res));

/**
 * @swagger
 * /api/v1.0/zodiac-per-week:
 *   post:
 *     tags:
 *       - zodiac
 *     summary: create new zodiac this api run by cron job everyweek don't has route
 *     description: this api create new zodiac in week

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
router.post('/zodiac-per-week', middleware.authenticateToken,(req, res) => zodiacController.createZodiac(2, res));

/**
 * @swagger
 * /api/v1.0/zodiac-per-month:
 *   post:
 *     tags:
 *       - zodiac
 *     summary: create new zodiac this api run by cron job everymonth don't has route
 *     description: this api create new zodiac in month

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
router.post('/zodiac-per-month', middleware.authenticateToken, (req, res) => zodiacController.createZodiac(3, res));

/**
 * @swagger
 * /api/v1.0/zodiac:
 *   get:
 *     tags:
 *       - zodiac
 *     summary: query all data in zodiac
 *     description: this api get all data in zodiac
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
router.get('/zodiac', middleware.authenticateToken, zodiacController.getAllZodiac);

/**
 * @swagger
 * /api/v1.0/zodiac-by-zodiac/{zodiac}:
 *   get:
 *     tags:
 *       - zodiac
 *     summary: This API to get all by field zodiac
 *     description: This API to get all by field zodiac
 *     parameters:
 *       - name: zodiac
 *         in: path
 *         required: true
 *         description: query all data in zodiac
 *         schema:
 *           type: string
 *           example: "Aries"
 *     
 *     responses:
 *       200:
 *         description: Horoscope data retrieved successfully.
 *       400:
 *         description: Bad Request - Invalid ID or other issues.
 *       500:
 *         description: Server error.
 */
router.get('/zodiac-by-zodiac/:zodiac', middleware.authenticateToken, zodiacController.getZodiacByZodiac);

/**
 * @swagger
 * /api/v1.0/zodiac/{id}:
 *   get:
 *     tags:
 *       - zodiac
 *     summary: This API to get all by field zodiac by id
 *     description: This API to get all by field zodiac by id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: query all data in zodiac
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "susss"
 *     
 *     responses:
 *       200:
 *         description: Horoscope data retrieved successfully.
 *       400:
 *         description: Bad Request - Invalid ID or other issues.
 *       500:
 *         description: Server error.
 */
router.get('/zodiac/:id', middleware.authenticateToken, zodiacController.getZodiacById);

module.exports = router;