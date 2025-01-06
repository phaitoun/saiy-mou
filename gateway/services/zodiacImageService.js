const prisma = require("../utils/prisma.js");

const getById = async (zodiac_image_id) => {
    try {
        const response = await prisma.zodiac_image.findFirst({
            where: {
                zodiac_image_id: zodiac_image_id
            }
        })
        return response
    } catch (error) {
        throw error
    }
}

module.exports = {
    getById
}