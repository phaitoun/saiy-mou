const couponController = require('../controller/couponController');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/v1.0/coupons:
 *   post:
 *     tags:
 *       - Coupons
 *     summary: Create multiple coupons
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               count:
 *                 type: integer
 *                 example: 5
 *               discount:
 *                 type: number
 *                 example: 20
 *               expires_at:
 *                 type: string
 *                 example: "2024-12-31T23:59:59Z"
 *               usage_limit:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Coupons created successfully.
 *       400:
 *         description: Required fields missing.
 *       500:
 *         description: Server error.
 */
router.post('/coupons', couponController.createCoupons);

/**
 * @swagger
 * /api/v1.0/coupons/{couponCode}:
 *   put:
 *     tags:
 *       - Coupons
 *     summary: Use a coupon by code
 *     parameters:
 *       - in: path
 *         name: couponCode
 *         schema:
 *           type: string
 *           example: "ABC123"
 *         required: true
 *         description: The code of the coupon to use.
 *     responses:
 *       200:
 *         description: Coupon used successfully.
 *       400:
 *         description: Invalid coupon code.
 *       404:
 *         description: Coupon not found or already used.
 *       500:
 *         description: Server error.
 */
router.put('/coupons/:couponCode', couponController.useCoupon);

/**
 * @swagger
 * /api/v1.0/coupons/{couponCode}:
 *   get:
 *     tags:
 *       - Coupons
 *     summary: Retrieve a coupon by code
 *     parameters:
 *       - in: path
 *         name: couponCode
 *         schema:
 *           type: string
 *           example: "ABC123"
 *         required: true
 *         description: The code of the coupon to retrieve.
 *     responses:
 *       200:
 *         description: Coupon details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "ABC123"
 *                 discount:
 *                   type: number
 *                   format: float
 *                   example: 15.00
 *                 expires_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-31T23:59:59Z"
 *                 isActive:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid coupon code.
 *       404:
 *         description: Coupon not found or already used.
 *       500:
 *         description: Server error.
 */
router.get('/coupons/:couponCode', couponController.getCouponByCode);

/**
 * @swagger
 * /api/v1.0/coupons:
 *   get:
 *     tags:
 *       - Coupons
 *     summary: Retrieve all coupons
 *     responses:
 *       200:
 *         description: List of all coupons.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     example: "ABC123"
 *                   discount:
 *                     type: number
 *                     format: float
 *                     example: 15.00
 *                   expires_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-12-31T23:59:59Z"
 *                   isActive:
 *                     type: boolean
 *                     example: true
 *       500:
 *         description: Server error.
 */
router.get('/coupons', couponController.getAllCoupons);

/**
 * @swagger
 * /api/v1.0/coupons-by-date:
 *   get:
 *     tags:
 *       - Coupons
 *     summary: Get all coupons by expiration date
 *     parameters:
 *       - in: query
 *         name: expired_at
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-09-10"
 *         required: true
 *         description: The expiration date to filter coupons by
 *     responses:
 *       200:
 *         description: Coupons retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Coupons retrieved successfully."
 *                 coupons:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                         example: "123456"
 *                       discount:
 *                         type: number
 *                         example: 20
 *                       expires_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-09-10T00:00:00Z"
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *       400:
 *         description: Expired date is required
 *       404:
 *         description: No coupons found for the specified expiration date
 *       500:
 *         description: Error retrieving coupons
 */
router.get('/coupons-by-date', couponController.getCouponsByDate);

/**
 * @swagger
 * /api/v1.0/coupons/{id}:
 *   delete:
 *     tags:
 *       - Coupons
 *     summary: Delete a coupon by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "8b3c09d9-6eea-442e-ab28-349c435bdcd2"
 *         required: true
 *         description: The ID of the coupon to delete.
 *     responses:
 *       200:
 *         description: Coupon deleted successfully.
 *       400:
 *         description: Invalid ID.
 *       404:
 *         description: Coupon not found.
 *       500:
 *         description: Server error.
 */
router.delete('/coupons/:id', couponController.deleteCouponById);

/**
 * @swagger
 * /api/v1.0/coupons:
 *   delete:
 *     tags:
 *       - Coupons
 *     summary: Delete coupons when you create incorrect date
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               expires_at:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-08-01T00:00:00Z"
 * 
 *     responses:
 *       200:
 *         description: Deleted expired coupons successfully.
 *       400:
 *         description: Invalid request data.
 *       500:
 *         description: Internal server error.
 */
router.delete('/coupons', couponController.deleteCouponsByDate);

module.exports = router;
