const prisma = require('../utils/prisma.js');
const { webkit } = require('playwright');


const createZodiac = async (data) => {
    const generateRandomSixBaseCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a random 6-digit number
    };

    const generateRandomTwoBaseCode = () => {
        return Math.floor(10 + Math.random() * 90).toString(); // Generates a random 2-digit number
    };

    try {
        // API to AI Generate
        const browser = await webkit.launch({ headless: true });
        const page = await browser.newPage();

        // Allow page to load and prepare
        await new Promise(resolve => setTimeout(resolve, 1000));
        await page.goto('https://copilot.microsoft.com/', { waitUntil: 'networkidle' });
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Fill prompt and submit
        await page.fill('textarea.text-area', data.prompt);
        await page.click('button[aria-label="Submit"]');
        await new Promise(resolve => setTimeout(resolve, 20000));

        // Wait for content to be generated
        page.waitForSelector('div.ac-container');

        // Extract descriptions under each <h3>
        const descriptions = await page.$$eval('h3', headers => {
            return headers.map(header => {
                const nextElement = header.nextElementSibling;
                const number = nextElement && nextElement.tagName === 'P' ? nextElement.querySelector('strong').innerText : '';
                const description = nextElement && nextElement.nextElementSibling && nextElement.nextElementSibling.tagName === 'P' ? nextElement.nextElementSibling.innerText : '';
                return { number, description };
            });
        });

        // Go to Google Translate and translate each description
        await page.goto('https://translate.google.com/?sl=en&tl=lo&op=translate', { waitUntil: 'networkidle' });
        const translatedTexts = [];

        await new Promise(resolve => setTimeout(resolve, 1000));
        for (let { description } of descriptions) {
            if (description) {
                await page.fill('textarea.er8xn', description);
                await new Promise(resolve => setTimeout(resolve, 15000));
                await page.waitForSelector('span.HwtZe', { timeout: 20000 });
                await new Promise(resolve => setTimeout(resolve, 10000));

                const translatedText = await page.evaluate(() => {
                    const spanElement = document.querySelector('span.HwtZe');
                    return spanElement ? spanElement.innerText : 'Translation not found';
                });
                translatedTexts.push(translatedText);
            }
        }

        // Close the browser
        await browser.close();

        // Set the time to the current time plus 8 hours
        const now = new Date();
        now.setHours(now.getHours() + 8);


        
        //select id image
        
        const responseImage = await prisma.zodiac_image.findMany()
        
        const imageZodiac = responseImage.find(element => element.name ===data.zodiacSigns)
   
        
        // Create the Zodiac entry in the database
        let zodiac = await prisma.$transaction(async tx => {
            const result = await tx.zodiac.create({
                data: {
                    status: data.status,
                        lucky_number: generateRandomSixBaseCode(),
                        description_love: translatedTexts[0] || "ສໍາລັບຄົນໂສດ, ນີ້ແມ່ນເວລາທີ່ເຈົ້າກໍາລັງຊອກຫາຄົນທີ່ເຈົ້າສາມາດເພິ່ງພາອາໄສໄດ້. ຫຼື ອາດຈະເປັນຄົນທີ່ໃຫ້ບ່ອນພັກຜ່ອນແກ່ເຈົ້າ. ບໍ່ສົນເລື່ອງຂອງສະເປັກ ຫຼື ຮູບລັກສະນະ. ລາວຍັງບໍ່ມີຄວາມຮູ້ສຶກດີສໍາລັບເຈົ້າ. ສຳລັບຄົນທີ່ມີຄູ່ແລ້ວ ທ່ານ​ຕ້ອງ​ລະວັງ​ເລື່ອງ​ການ​ເງິນ​ທີ່​ພາ​ໃຫ້​ເກີດ​ການ​ໂຕ້​ຖຽງ​ກັນ​ລະຫວ່າງ​ເຈົ້າກັບ​ຄົນ​ທີ່​ເຈົ້າ​ຮັກ.",
                        description_love_EN:descriptions[0].description || "",
                        progress_love: descriptions[0].number || generateRandomTwoBaseCode(),
                        description_job_EN: descriptions[1].description || "",
                        description_job: translatedTexts[1] || "ມີ​ເກນ​ທີ່​ເຈົ້າ​ຈະ​ເດີນ​ທາງ​ໃນ​ເລື່ອງ​ການ​ເຮັດ​ວຽກ ຫຼື ໄດ້ຍ້າຍໄປບ່ອນເຮັດວຽກ. ແຕ່ໃນໄລຍະນີ້, ທ່ານອາດຈະຕ້ອງລະວັງບັນຫາທີ່ກ່ຽວກັບຄົນ ຫຼື ຄໍາເວົ້າຂອງເຈົ້າອາດຈະເວົ້າບາງຢ່າງແຕ່ຄົນອື່ນເຂົ້າໃຈຜິດ ແລະ ອາດຈະຕ້ອງລະມັດລະວັງກ່ຽວກັບລູກຈ້າງ ຫຼື ຄົນທີ່ມີປະສົບການໃນການເຮັດວຽກຫນ້ອຍກວາດບັນຫາພາຍໃຕ້ຜ້າພົມ.",
                        progress_job: descriptions[1].number || generateRandomTwoBaseCode(),
                        description_money_EN: descriptions[2].description || "",
                        description_money: translatedTexts[2] || "​ເດືອນ​ນີ້​ມີ​ໂອກາດ​ມີ​ເງິນ​ໃຊ້​ຈ່າຍ​ໃນ​ການ​ສ້ອມ​ແປງ​ເຮືອນ​ຫຼື​ລົດ​ທີ່​ມີ​ລາຍ​ຈ່າຍ​ຫຼາຍ​ສົມຄວນ. ແຕ່ລາຍຮັບຍັງຕໍ່າ ແລະ ມີເງື່ອນໄຂທີ່ຈະໄດ້ຮັບເງິນຈາກການຮຽກຮ້ອງປະກັນໄພ ຫຼື ເງິນທີ່ໄດ້ລົງທຶນໃນເມື່ອກ່ອນໃນບາງສິ່ງບາງຢ່າງ",
                        progress_money: descriptions[2].number || generateRandomTwoBaseCode(),
                        created_at: now,
                        name: data.zodiacSigns,
                        zodiac_image_id: imageZodiac.zodiac_image_id
                }
            });
            return result;
        });

        return zodiac;

    } catch (error) {
        console.error("Service error creating zodiac:", error);
        throw error;
    }
};


const getAllZodiac = async () => {
    try {
        const zodiac = await prisma.zodiac.findMany()
        return zodiac;
    } catch (error) {
        console.error("Service error retrieving all zodiac:", error);
        throw error;
    }
};


const getZodiacByZodiac = async (zodiac) => {
    try {
        const zodiacAllData = await prisma.zodiac.findFirst({
                    where: { zodiac: zodiac },
                });
        return zodiacAllData;
    } catch (error) {
        console.error("Service error retrieving Zodiac by ID:", error);
        throw error;
    }
};

const getZodiacById = async (id) => {
    try {        
        const zodiacData = await prisma.zodiac.findFirst({
                    where: { zodiac_id: id },
                });
        return zodiacData;
    } catch (error) {
        console.error("Service error retrieving Zodiac by ID:", error);
        throw error;
    }
};


const deleteAllZodiac = async (status) => {
    try {
        await prisma.$transaction(async tx => {
            try {
                await tx.zodiac.deleteMany({
                    where: {
                        status:status,
                        created_at: {
                            lte: new Date()
                        }
                    }
                });
            } catch (error) {
                console.error(error);
                throw error;
            }
        });

    } catch (error) {
        console.error("Service error deleting coupons:", error.message);
        throw error;
    }
};

module.exports = {
    createZodiac,
    getAllZodiac,
    getZodiacByZodiac,
    getZodiacById,
    deleteAllZodiac,
};
