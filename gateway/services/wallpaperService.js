
const prisma = require('../utils/prisma.js');
const {
    firefox,
    webkit
} = require('playwright');

const createWallpaper = async (data) => {
    try {



        const wallpaper = await prisma.$transaction(async tx => {
            try {
                const result = await tx.wallpaper.create({
                    data: {
                        date_of_birth: data.date_of_birth,
                        day_of_birth: data.day_of_birth,
                        name: data.name,
                        tel: data.tel,
                        gender: data.gender,
                        gods: data.gods,
                        occupation: data.occupation,
                        price: 50000,
                        image_id: data.image_id,
                        paid: false,
                        users: {
                            connect: {
                                user_id: data.user_id
                            }
                        },
                    },
                });

                return result
            } catch (error) {
                console.error(error)
                throw error
            }
        })

        return wallpaper;
    } catch (error) {
        console.error("Service error creating wallpaper:", error);
        throw error;
    }
};


const getAllWallpaper = async (user_id) => {
    try {

        const result = await prisma.wallpaper.findMany({
            where: {
                user_id: user_id
            },
        });
        console.log(result);

        return result

    } catch (error) {
        console.error("Service error retrieving all wallpaper:", error);
        throw error;
    }
};


const getWallpaperById = async (id) => {
    try {
        const wallpaper = await prisma.wallpaper.findFirst({
            where: {
                wallpaper_id: id
            },
        });

        return wallpaper;
    } catch (error) {
        console.error("Service error retrieving a wallpaper:", error);
        throw error;
    }
};


const buyWallpaperById = async (data) => {
    try {
        const wallpaper = await prisma.wallpaper.findFirst({
            where: {
                wallpaper_id: data.id
            }
        });

        if (!wallpaper) {
            return {
                message: 'Wallpaper ID not found',
                status: false
            };
        }

        const discount = data.discount || 0; // Default to 0 if no discount is provided
        const priceWallpaper = wallpaper.price - discount;

        // Simulate API call to the bank (to be implemented)
        const bankSuccess = true; // Assume bank transaction is successful for now

        if (!bankSuccess) {
            return {
                message: 'Transfer money not successful',
                status: false
            };
        } else {
            const buyWallpaper = await prisma.$transaction(async tx => {
                try {
                    const result = await tx.wallpaper.update({
                        where: {
                            wallpaper_id: data.id
                        },
                        data: {
                            paid: true,
                        },
                    });
                    return result;
                } catch (error) {
                    throw error;
                }
            });
            return {
                data: buyWallpaper,
                message: 'Buy wallpaper success',
                status: true
            };
        }

    } catch (error) {
        console.error("Service error buying wallpaper:", error);
        throw error;
    }
};


const deleteWallpaper = async (id) => {
    try {
        const wallpaper = await prisma.wallpaper.delete({
            where: {
                wallpaper_id: id
            },
        });
        return wallpaper;
    } catch (error) {
        console.error("Service error deleting wallpaper:", error);
        throw error;
    }
};

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

        await new Promise(resolve => setTimeout(resolve, 10000));

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

module.exports = {
    createWallpaper,
    getAllWallpaper,
    getWallpaperById,
    buyWallpaperById,
    deleteWallpaper,
    generateImageService
};