const personalController = require('../controller/personalController')
const middleware = require("../middleware/authenticateToken")

const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/v1.0/personal:
 *   post:
 *     tags:
 *       - Personal
 *     summary: Use for create personal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: uuid
 *                 example: "user_id"
 *               name:
 *                  type: string
 *                  example: "John Doe"
 *               gender:
 *                  type: string
 *                  example: "male"
 *               date_of_birth:
 *                  type: string
 *                  example: "1990-01-01T00:00:00Z"
 *               phone_number:
 *                  type: string
 *                  example: "1234567890"
 *               occupation:
 *                  type: string
 *                  example: "Software Developer"
 *               relationship_status:
 *                  type: string
 *                  example: "single"
 *               password:
*                   type: string
*                   example: "password example"
 *
 *     responses:
 *       201:
 *         description: create success.
 *       400:
 *         description: No data provided
 *       500:
 *         description: server error
 */
router.post('/personal',middleware.authenticateToken, personalController.createNewPersonal);

/**
 * @swagger
 * /api/v1.0/personal-by-user-id/{user_id}:
 *   get:
 *     tags:
 *       - Personal
 *     summary: Use for get personal by user_id
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "user_id"
 *         required: true
 *         description: User ID of the users to get personal
 *
 *     responses:
 *       200:
 *         description: A personal information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 personal_id:
 *                     type: uuid
 *                     example: "user_id"
 *                 name:
 *                     type: string
 *                     example: "John Doe"
 *                 gender:
 *                     type: string
 *                     example: "male"
 *                 date_of_birth:
 *                     type: string
 *                     example: "1990-01-01T00:00:00Z"
 *                 phone_number:
 *                     type: integer
 *                     example: 1234567890
 *                 occupation:
 *                     type: string
 *                     example: "Software Developer"
 *                 relationship_status:
 *                     type: string
 *                     example: "single"
 *                 password:
 *                     type: string
 *                     example: "$2b$10$bP4fB8jraf7XdXIOwz0/qODwMnd07fcuq5pVgHXs1p2sNmPukFv.2"
 *       400:
 *         description: No data provided
 *       404:
 *         description: Data not found
 *       500:
 *         description: server error
 */
router.get('/personal-by-user-id/:user_id',middleware.authenticateToken, personalController.getPersonalByUserId);

/**
 * @swagger
 * /api/v1.0/personal/{personal_id}:
 *   put:
 *     tags:
 *       - Personal
 *     summary: Use for update personal
 *     parameters:
 *       - in: path
 *         name: personal_id
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "personal_id"
 *         required: true
 *         description: Personal_id of the personal to update personal information
 *     requestBody: 
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                  type: string
 *                  example: "John Doe"
 *               user_id:
 *                  type: string
 *                  example: "80f9724c-0646-4c87-a246-22aa84cc143b"
 *               gender:
 *                  type: string
 *                  example: "male"
 *               date_of_birth:
 *                  type: string
 *                  example: "1990-01-01T00:00:00Z"
 *               phone_number:
 *                  type: string
 *                  example: "1234567890"
 *               occupation:
 *                  type: string
 *                  example: "Software Developer"
 *               relationship_status:
 *                  type: string
 *                  example: "single"
 * 
 *     responses:
 *       200:
 *         description: A personal information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 personal_id:
 *                     type: uuid
 *                     example: "8b3c09d9-6eea-442e-ab28-349c435bdcd2"
 *                 name:
 *                     type: string
 *                     example: "John Doe"
 *                 gender:
 *                     type: string
 *                     example: "male"
 *                 date_of_birth:
 *                     type: string
 *                     example: "1990-01-01T00:00:00Z"
 *                 phone_number:
 *                     type: integer
 *                     example: 1234567890
 *                 occupation:
 *                     type: string
 *                     example: "Software Developer"
 *                 relationship_status:
 *                     type: string
 *                     example: "single"
 *                
 *       400:
 *         description: No data provided
 *       404:
 *         description: Data not found
 *       500:
 *         description: server error
 */
router.put('/personal/:personal_id',middleware.authenticateToken, personalController.updatePersonal);

/**
 * @swagger
 * /api/v1.0/personal/{id}:
 *   delete:
 *     tags:
 *       - Personal
 *     summary: Use for delete personal
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "id"
 *         required: true
 *         description: Personal_id of the personal to delete personal information
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
router.delete('/personal/:personal_id',middleware.authenticateToken, personalController.deletePersonal);


/**
 * @swagger
 * /api/v1.0/personal/{personal_id}:
 *   get:
 *     tags:
 *       - Personal
 *     summary: use for get personal by personal_id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "personal_id"
 *         required: true
 *         description: User ID of the users to get personal
 *
 *     responses:
 *       200:
 *         description: A personal information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 personal_id:
 *                     type: uuid
 *                     example: "ea507e20-767a-48cf-b2b8-74f688ee06fb"
 *                 name:
 *                     type: string
 *                     example: "John Doe"
 *                 gender:
 *                     type: string
 *                     example: "male"
 *                 date_of_birth:
 *                     type: string
 *                     example: "1990-01-01T00:00:00Z"
 *                 phone_number:
 *                     type: integer
 *                     example: 1234567890
 *                 occupation:
 *                     type: string
 *                     example: "Software Developer"
 *                 relationship_status:
 *                     type: string
 *                     example: "single"
 *                 password:
 *                     type: string
 *                     example: "$2b$10$bP4fB8jraf7XdXIOwz0/qODwMnd07fcuq5pVgHXs1p2sNmPukFv.2"
 *       400:
 *         description: No data provided
 *       404:
 *         description: Data not found
 *       500:
 *         description: server error
 */
router.get('/personal/:id',middleware.authenticateToken, personalController.getPersonalById)
module.exports = router;
