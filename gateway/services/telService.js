const prisma = require('../utils/prisma.js');
const { webkit } = require('playwright');  // Import Playwright



const createTelephone = async (generateData) => {
    try {                        
        const telephone = await prisma.$transaction(async tx => {
            try {
                const result = await tx.telephone.findFirst({
                    where: {
                        user_id:generateData.user_id,
                        tel: generateData.tel,
                        date_of_birth: generateData.date_of_birth
                    },
                });
                
                return result
            } catch (error) {
                console.error(error)
                throw error
            }
        })

        if (telephone == null || telephone.tel != generateData.tel) {            

            //API to AI Genarate
            const browser = await webkit.launch({ headless: true });
            const page = await browser.newPage();
            await new Promise(resolve => setTimeout(resolve, 3000));

            
            // Go to Copilot Microsoft
            await page.goto('https://copilot.microsoft.com/', { waitUntil: 'networkidle' });
            const prompt = 
            `
            can you horoscope about phone number for me. my phone number is +856 ${generateData.tel}, my birth date is ${generateData.date_of_birth}, 
            shortly i want three description for 
            one description about my real personality and 
            one description about my love and the last 
            one description about my disadvantages. 
            don't forget this is about horoscope phone number
            `
            await new Promise(resolve => setTimeout(resolve, 4000));
            // Type the prompt into the text area
            await page.fill('textarea.text-area', prompt,{ timeout: 10000 });
            await new Promise(resolve => setTimeout(resolve, 3000));
        
            await page.click('button[aria-label="Submit"]');
        
            await new Promise(resolve => setTimeout(resolve, 30000));
            
            // Wait for the response to be generated
            page.waitForSelector('div.ac-container');
        
            // Extract the content of <p> tags under each <h3> tag
            const descriptions = await page.$$eval('h3', headers => {
                return headers.map(header => {
                    const nextElement = header.nextElementSibling;
                    return nextElement && nextElement.tagName === 'P' ? nextElement.innerText : '';
                });
            });
            
            // Go to Google Translate
            await page.goto('https://translate.google.com/?sl=en&tl=lo&op=translate', { waitUntil: 'networkidle' });
            const translatedTexts = [];
        
            await new Promise(resolve => setTimeout(resolve, 4000));
            // Translate each description and log the translated text
            for (let description of descriptions) {
                if (description) {
                    await page.fill('textarea.er8xn', description);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    await page.waitForSelector('span.HwtZe', { timeout: 10000 });
                            
                    // Get the translated text from the span
                    const translatedText = await page.evaluate(() => {
                        const spanElement = document.querySelector('span.HwtZe');
                        return spanElement ? spanElement.innerText : 'Translation not found';
                    });
                    // Push the translated text to the array
                    translatedTexts.push(translatedText);
                }
            }            
            
            // Close the browser
            await browser.close();
            
            const newTelephone = await prisma.$transaction(async tx => {
                try {
                    result = await tx.telephone.create({
                        data: {
                            tel: generateData.tel,
                            date_of_birth: generateData.date_of_birth,
                            description: translatedTexts[0] || "ເປັນຄົນອ່ອນຫວານ, ນຸ່ມນວນກິລິຍາມາລະຍາດຮຽບຮ້ອຍ, ມີຄວາມປານີດປານອຸມສູງ, ຮັກຄວາມສະຫງົບ,ອ່ອນນ້ອມຖ່ອມຕົນ, ເປັນຄົນທີ່ປາກຕົງກັບໃຈ ຄິດແນວໃດກໍເວົ້າແບບນັ້ນ, ຊື່ສັດ, ຊື້ຕົງ ແລະ ມີອຸດົມການຮັກໝູ່ເພື່ອນ, ຮັກຄອບຄົວ ແລະ ຮັກບ້ານ ມີຈິດໃຈລະອຽດອ່ອນ ມີພອນສະຫວັນ ແລະ ຊັ້ນເຊີງໃນງານສິລປະທຸກຮູບແບບ",
                            description_EN:descriptions[0] || "" ,
                            description_love: translatedTexts[1] || "ເວົ້າຕ້ອງການໃຜຄົນໜຶ່ງ ທີ່ເຮັດໃຫ້ຮູ້ສຶກອົບອຸ່ນ ໝັ້ນຄົງ ແລະ ເປັນຕົວຂອງຕົວເອງ",
                            description_love_EN:descriptions[1] || "",
                            disadvantage: translatedTexts[2] || "ເຈົ້າເປັນຄົນຫູເບົາ ເຊື່ອຄົນງ່າຍ ບໍ່ຮູ້ຈັກແຍກລະຫວ່າງ ຜິດ ກັບ ຖືກ ມັກເດືດອຮ້ອນ ແລະ ເສຍຊື່ສຽງເພາະຕົກເປັນເຫຍື້ອຂອງຜູ້ທີ່ມີເລ່ຫຼ່ຽມແພວພາວ",
                            disadvantage_EN:descriptions[2] || "",
                            users: {
                                connect: {
                                    user_id: generateData.user_id
                                }
                            },
                        },
                    });

                    return result
                } catch (error) {
                    throw error
                }
            })

            return newTelephone;
        }

        return telephone;
    } catch (error) {
        console.error("Service error creating telephone:", error);
        throw error;
    }
};


const getAllTelephone = async (user_id) => {
    try {
        const telephone = await prisma.telephone.findMany({
                    where: { user_id: user_id },
                });

        return telephone;
    } catch (error) {
        console.error("Service error retrieving all telephone:", error);
        throw error;
    }
};


const getTelephoneById = async (id) => {
    try {
        const telephone = await prisma.telephone.findFirst({
                    where: { telephone_id: id },
                });

        return telephone;
    } catch (error) {
        console.error("Service error retrieving a telephone:", error);
        throw error;
    }
};


const deleteTelephone = async (id) => {
    try {
        await prisma.$transaction(async tx => {
            try {
                await tx.telephone.delete({
                    where: { telephone_id: id },
                });
            } catch (error) {
                console.error(error)
                throw error
            }
        })
        
    } catch (error) {
        console.error("Service error deleting telephone:", error);
        throw error;
    }
};


module.exports = {
    createTelephone,
    getAllTelephone,
    getTelephoneById,
    deleteTelephone,
};