const {
    webkit,
    firefox
} = require('playwright');


const prisma = require('../utils/prisma.js');

const getImageService = async (image_id) => {

    const response = await prisma.images.findFirst({
        where: {
            image_id: image_id
        }

    });
    return response
}

const generateImageService = async (prompt, userData) => {
    try {

        //API to AI Genarate
        const browser = await webkit.launch({
            headless: true
        });
        const page = await browser.newPage();

        await page.goto('https://magicstudio.com/ai-art-generator/', {
            waitUntil: 'networkidle'
        });

        // Type the prompt into the text area
        await page.fill('textarea#description', prompt.prompt);

        await new Promise(resolve => setTimeout(resolve, 1000));

        await page.click('button:has-text("Create a Picture")');

        await new Promise(resolve => setTimeout(resolve, 4000));

        const imgSrc = await page.getAttribute('img.rounded-xl', 'src');
        // Close the browser
        await browser.close();

        // Remove any Base64 prefix (e.g., "data:image/png;base64,")
        const base64Data = imgSrc.replace(/^data:image\/\w+;base64,/, '');

        // Decode Base64 to binary data (buffer)
        const buffer = Buffer.from(base64Data, 'base64');



        const addBinary = await prisma.$transaction(async tx => {
            try {

                const responseImageId = await tx.images.create({
                    data: {
                        image_file: buffer
                    }
                })
                await tx.wallpaper.create({
                    data: {
                        user_id: userData.user_id,
                        date_of_birth: userData.date_of_birth,
                        day_of_birth: userData.day_of_birth,
                        name: userData.name,
                        tel: userData.tel,
                        gender: userData.gender,
                        gods: userData.gods,
                        occupation: userData.occupation,
                        price: 50000,
                        paid: false,
                        image_id: responseImageId.image_id
                    }
                })
                return responseImageId
            } catch (error) {
                throw new Error('Transaction failed: ' + error.message);
            }
        });
        return addBinary
    } catch (error) {
        throw error
    }
}

const deleteImageByIdService = async (image_id) => {
    try {
        const response = await prisma.$transaction(async tx => {
            const deleteImage = await tx.images.delete({
                where: {
                    image_id: image_id
                }
            })
            return deleteImage
        })
        return response
    } catch (error) {
        throw error
    }
}

module.exports = {
    getImageService,
    generateImageService,
    deleteImageByIdService
}