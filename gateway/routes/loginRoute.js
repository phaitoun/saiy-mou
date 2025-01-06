const loginController = require("../controller/loginController")
const middleware = require("../middleware/loginMiddleware")
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const limiterOTP = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 5, // limit each IP to 100 requests per windowMs
    message: {
        message: "Too many requests, please try again later."
    }
});
const limiterLogin = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 6, // limit each IP to 100 requests per windowMs
    message: 'Too many login attempts, please try again after 10 minutes.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
/**
 * @swagger
 * /api/v1.0/send-otp:
 *   post:
 *     tags:
 *       - authentication
 *     summary: Request OTP for email confirmation
 *     description: This API receives an email as a string and sends an OTP to the specified email address. The OTP can be used for registration confirmation or password recovery.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: OTP sent successfully to the provided email.
 *       400:
 *         description: Bad Request - Invalid email or other issues.
 *       500:
 *         description: server error
 */
router.post('/send-otp', limiterOTP, loginController.sendOtp);

/**
 * @swagger
 * /api/v1.0/login:
 *   post:
 *     tags:
 *       - authentication
 *     summary: Use for request access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@gmail.com"
 *               password:
 *                  type: string
 *                  example: "password example"
 *     responses:
 *       200:
 *         description: login success.
 *       400:
 *         description: Bad Request - Invalid email or other issues.
 *       500:
 *         description: server error
 *       422:
 *         description: Email or password is required
 *       403:
 *         description: Email or Password is not valid
 */
router.post('/login', limiterLogin, loginController.loginUser);

/**
 * @swagger
 * /api/v1.0/register:
 *   post:
 *     tags:
 *       - authentication
 *     summary: Use for confirm OTP to create user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               OTP:
 *                  type: string
 *                  example: "000000"
 *     responses:
 *       201:
 *         description: user created success.
 *       400:
 *         description: Bad Request - Invalid OTP.
 *       500:
 *         description: server error
 */
router.post('/register', loginController.registerUser);
/**
 * @swagger
 * /api/v1.0/forgot-password:
 *   post:
 *     tags:
 *       - authentication
 *     summary: Use to change password when a user forgets their password. The user requests an OTP first to confirm the password change.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password example"
 *               OTP:
 *                 type: string
 *                 example: "000000"
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *       400:
 *         description: Bad Request - OTP is invalid or expire.
 *       404:
 *         description: user not found
 *       500:
 *         description: server error
 */

router.post('/forgot-password', loginController.forgotPassword)
/**
 * @swagger
 * /api/v1.0/refresh-token:
 *   post:
 *     tags:
 *       - authentication
 *     summary: use to request accessToken when accessToken is expire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "example refreshToken"

 *     responses:
 *       200:
 *         description: success
 *       401:
 *         description: Bad Request 
 *       404:
 *         description: user not found
 *       500:
 *         description: server error
 */

router.post('/refresh-token', loginController.refreshToken)


module.exports = router;