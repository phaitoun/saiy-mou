const telController = require('../controller/telController')
const middleware = require('../middleware/authenticateToken')
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/v1.0/telephone:
 *   post:
 *     tags:
 *       - Telephone
 *     summary: Use for create telephone
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
 *               tel:
 *                 type: string
 *                 example: "1234567890"
 *               date_of_birth:
 *                 type: date
 *                 example: 1988-07-15T00:00:00.000Z
 *
 *     responses:
 *       201:
 *         description: A telephone horoscope
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tel:
 *                   type: integer
 *                   example: 1234567890
 *                 description:
 *                   type: string
 *                   example: "ຕົວຈິງຂອງເຈົ້າ: ເປັນຄົນອ່ອນຫວານ, ນຸ່ມນວນກິລິຍາມາລະຍາດຮຽບຮ້ອຍ, ມີຄວາມປານີດປານອຸມສູງ, ຮັກຄວາມສະຫງົບ,ອ່ອນນ້ອມຖ່ອມຕົນ, ເປັນຄົນທີ່ປາກຕົງກັບໃຈ ຄິດແນວໃດກໍເວົ້າແບບນັ້ນ, ຊື່ສັດ, ຊື້ຕົງ ແລະ ມີອຸດົມການຮັກໝູ່ເພື່ອນ, ຮັກຄອບຄົວ ແລະ ຮັກບ້ານ ມີຈິດໃຈລະອຽດອ່ອນ ມີພອນສະຫວັນ ແລະ ຊັ້ນເຊີງໃນງານສິລປະທຸກຮູບແບບ."
 *                 description_love:
 *                   type: string
 *                   example: "ເລື່ອງຄວາມຮັກ: ເວົ້າຕ້ອງການໃຜຄົນໜຶ່ງ ທີ່ເຮັດໃຫ້ຮູ້ສຶກອົບອຸ່ນ ໝັ້ນຄົງ ແລະ ເປັນຕົວຂອງຕົວເອງ."
 *                 disadvantage:
 *                   type: string
 *                   example: "ຈຸດອ່ອນ: ເຈົ້າເປັນຄົນຫູເບົາ ເຊື່ອຄົນງ່າຍ ບໍ່ຮູ້ຈັກແຍກລະຫວ່າງ ຜິດ ກັບ ຖືກ ມັກເດືດອຮ້ອນ ແລະ ເສຍຊື່ສຽງເພາະຕົກເປັນເຫຍື້ອຂອງຜູ້ທີ່ມີເລ່ຫຼ່ຽມແພວພາວ."
 *       400:
 *         description: No data provided
 *       500:
 *         description: server error
 */
router.post('/telephone',middleware.authenticateToken,telController.createTelephone);

/**
 * @swagger
 * /api/v1.0/telephone/user/{user_id}:
 *   get:
 *     tags:
 *       - Telephone
 *     summary: Retrieve a telephone number by user_id
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "4750878e-2738-4eb5-a54a-a905d98a04e4"
 *         required: true
 *         description: UUID of the user whose telephone number is being retrieved
 *
 *     responses:
 *       200:
 *         description: A telephone horoscope
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tel:
 *                   type: integer
 *                   example: 1234567890
 *                 description:
 *                   type: string
 *                   example: "ຕົວຈິງຂອງເຈົ້າ: ເປັນຄົນອ່ອນຫວານ, ນຸ່ມນວນກິລິຍາມາລະຍາດຮຽບຮ້ອຍ, ມີຄວາມປານີດປານອຸມສູງ, ຮັກຄວາມສະຫງົບ,ອ່ອນນ້ອມຖ່ອມຕົນ, ເປັນຄົນທີ່ປາກຕົງກັບໃຈ ຄິດແນວໃດກໍເວົ້າແບບນັ້ນ, ຊື່ສັດ, ຊື້ຕົງ ແລະ ມີອຸດົມການຮັກໝູ່ເພື່ອນ, ຮັກຄອບຄົວ ແລະ ຮັກບ້ານ ມີຈິດໃຈລະອຽດອ່ອນ ມີພອນສະຫວັນ ແລະ ຊັ້ນເຊີງໃນງານສິລປະທຸກຮູບແບບ."
 *                 description_love:
 *                   type: string
 *                   example: "ເລື່ອງຄວາມຮັກ: ເວົ້າຕ້ອງການໃຜຄົນໜຶ່ງ ທີ່ເຮັດໃຫ້ຮູ້ສຶກອົບອຸ່ນ ໝັ້ນຄົງ ແລະ ເປັນຕົວຂອງຕົວເອງ."
 *                 disadvantage:
 *                   type: string
 *                   example: "ຈຸດອ່ອນ: ເຈົ້າເປັນຄົນຫູເບົາ ເຊື່ອຄົນງ່າຍ ບໍ່ຮູ້ຈັກແຍກລະຫວ່າງ ຜິດ ກັບ ຖືກ ມັກເດືດອຮ້ອນ ແລະ ເສຍຊື່ສຽງເພາະຕົກເປັນເຫຍື້ອຂອງຜູ້ທີ່ມີເລ່ຫຼ່ຽມແພວພາວ."
 *       400:
 *         description: No data provided
 *       404:
 *         description: Data not found
 *       500:
 *         description: server error
 */
router.get('/telephone/user/:user_id',middleware.authenticateToken,telController.getAllTelephone);

/**
 * @swagger
 * /api/v1.0/telephone/{id}:
 *   get:
 *     tags:
 *       - Telephone
 *     summary: Retrieve telephone details by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "f63a794a-12f1-402d-909c-d77ec496afde"
 *         required: true
 *         description: UUID of the telephone entry to retrieve
 *
 *     responses:
 *       200:
 *         description: A telephone horoscope
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tel:
 *                   type: integer
 *                   example: 1234567890
 *                 description:
 *                   type: string
 *                   example: "ຕົວຈິງຂອງເຈົ້າ: ເປັນຄົນອ່ອນຫວານ, ນຸ່ມນວນກິລິຍາມາລະຍາດຮຽບຮ້ອຍ, ມີຄວາມປານີດປານອຸມສູງ, ຮັກຄວາມສະຫງົບ,ອ່ອນນ້ອມຖ່ອມຕົນ, ເປັນຄົນທີ່ປາກຕົງກັບໃຈ ຄິດແນວໃດກໍເວົ້າແບບນັ້ນ, ຊື່ສັດ, ຊື້ຕົງ ແລະ ມີອຸດົມການຮັກໝູ່ເພື່ອນ, ຮັກຄອບຄົວ ແລະ ຮັກບ້ານ ມີຈິດໃຈລະອຽດອ່ອນ ມີພອນສະຫວັນ ແລະ ຊັ້ນເຊີງໃນງານສິລປະທຸກຮູບແບບ."
 *                 description_love:
 *                   type: string
 *                   example: "ເລື່ອງຄວາມຮັກ: ເວົ້າຕ້ອງການໃຜຄົນໜຶ່ງ ທີ່ເຮັດໃຫ້ຮູ້ສຶກອົບອຸ່ນ ໝັ້ນຄົງ ແລະ ເປັນຕົວຂອງຕົວເອງ."
 *                 disadvantage:
 *                   type: string
 *                   example: "ຈຸດອ່ອນ: ເຈົ້າເປັນຄົນຫູເບົາ ເຊື່ອຄົນງ່າຍ ບໍ່ຮູ້ຈັກແຍກລະຫວ່າງ ຜິດ ກັບ ຖືກ ມັກເດືດອຮ້ອນ ແລະ ເສຍຊື່ສຽງເພາະຕົກເປັນເຫຍື້ອຂອງຜູ້ທີ່ມີເລ່ຫຼ່ຽມແພວພາວ."
 *       400:
 *         description: No data provided
 *       404:
 *         description: Data not found
 *       500:
 *         description: server error
 */
router.get('/telephone/:id',middleware.authenticateToken,telController.getTelephoneById);
/**
 * @swagger
 * /api/v1.0/telephone/{id}:
 *   delete:
 *     tags:
 *       - Telephone
 *     summary: Deletes a telephone entry by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "f63a794a-12f1-402d-909c-d77ec496afde"
 *         required: true
 *         description: The UUID of the telephone record to be deleted
 *     responses:
 *       200:
 *         description: Telephone deleted successfully.
 *       400:
 *         description: Invalid or missing data provided.
 *       404:
 *         description: Telephone record not found.
 *       500:
 *         description: Server error.
 */

router.delete('/telephone/:id',middleware.authenticateToken,telController.deleteTelephone);

module.exports = router;