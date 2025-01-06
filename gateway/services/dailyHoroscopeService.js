const prisma = require("../utils/prisma.js");
const {
    webkit
} = require('playwright');
/**
 * Create Daily Horoscope Service
 * 
 * This service function creates a new daily horoscope record in the database.
 * It runs within a Prisma transaction and includes error handling for both 
 * the transaction and the record creation process.
 * 
 * @param {Object} data - The data to create a new daily horoscope.
 * @param {Number} data.lucky_number - The lucky number for the horoscope.
 * @param {String} data.description_health - The description for health.
 * @param {String} data.week_day - The day of the week for the horoscope.
 * @param {String} data.lucky_color - The lucky color for the horoscope.
 * @param {String} data.description_love - The description for love.
 * @param {String} data.description_money - The description for money.
 * @param {Date} data.start_date - The start date of the horoscope period.
 * @param {Date} data.end_date - The end date of the horoscope period.
 * 
 * @returns {Promise<Object>} The created daily horoscope record.
 * 
 * @throws {Error} If the transaction or the record creation fails.
 */
const createDailyHoroscopeService = async (data) => {
    const generateRandomBaseCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a random 6-digit number
    };

    try {

        //API to AI Genarate
        const browser = await webkit.launch({
            headless: true
        }); // change false for debuging or open browser
        const page = await browser.newPage();

        await new Promise(resolve => setTimeout(resolve, 5000));
        // Go to Copilot Microsoft
        await page.goto('https://copilot.microsoft.com/', {
            waitUntil: 'networkidle'
        });

        await new Promise(resolve => setTimeout(resolve, 10000));

        const prompt =
            `
            can you horoscope about day. Assume today is ${data.dayOfWeek} on ${data.day}, 
            shortly i want four tag h3 and description for 
            one description about my work aspect and 
            one description about my Financially and 
            one description about my The love side and 
            the last one description about my health aspect. 
            don't forget this is about horoscope day. no link in description
            `
            
            // Type the prompt into the text area
            await page.fill('textarea.text-area', prompt);
        
            await page.click('button[aria-label="Submit"]');
        
            await new Promise(resolve => setTimeout(resolve, 60000));
            
            // Wait for the response to be generated
            page.waitForSelector('div.ac-container');
        
            // Extract the content of <p> tags under each <h3> tag
            const descriptions = await page.$$eval('h3', headers => {
                return headers.map(header => {
                    const nextElement = header.nextElementSibling;
                    return nextElement && nextElement.tagName === 'P' ? nextElement.innerText : '';
                });
            });
        await new Promise(resolve => setTimeout(resolve, 10000));

        // Go to Google Translate
        await page.goto('https://translate.google.com/?sl=en&tl=lo&op=translate', {
            waitUntil: 'networkidle'
        });
        const translatedTexts = [];

        await new Promise(resolve => setTimeout(resolve, 15000));

        // Translate each description and log the translated text
        for (let description of descriptions) {
            if (description) {
                await page.fill('textarea.er8xn', description);
                await page.waitForSelector('span.HwtZe', {
                    timeout: 10000
                });


                //wait 3 second
                await new Promise(resolve => setTimeout(resolve, 10000));

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

        const now = new Date();
        now.setHours(now.getHours() + 7);

        //get id logo image
        const logoService = await prisma.logo_daily.findFirst({
            where: {
                week_day: data.dayOfWeek
            }
        })

        const response = await prisma.$transaction(async tx => {
            try {

                const create = await tx.daily_horoscope.create({
                    data: {
                        week_day: data.dayOfWeek,
                        lucky_number: generateRandomBaseCode(),
                        description_job: translatedTexts[0] || "ການ​ເຮັດ​ວຽກ​, ການ​ຕິດ​ຕໍ່​ທຸ​ລະ​ກິດ​ການ​ພົວພັນ​ກັບ​ຕ່າງປະ​ເທດ ຈະຢູ່ໃນສະພາບທີ່ດີ ແຕ່ເຈົ້າຄວນຈະລະມັດລະວັງກ່ຽວກັບການຮ່ວມມືເຮັດວຽກກັບຄົນຕ່າງປະເທດເພາະວ່າລາວອາດຈະເປັນ ນົກສອງຫົວ, ຮັບເອົາສອງວຽກ. ມາປຸກລະດົມສ້າງຄວາມເສຍຫາຍໃຫ້ວຽກງານຢ່າງໃຫຍ່ຫຼວງ! ຖ້າເຈົ້າເປັນຄົນທີ່ມີເງິນເດືອນ ຖ້າເຈົ້າເຫັນເພື່ອນຮ່ວມງານແບບນີ້ ເຈົ້າອາດຈະຖືກຂົ່ມເຫັງ, ໃສ່ຮ້າຍປ້າຍສີ ແລະ ບັງຄັບຈົນກວ່າເຈົ້າບໍ່ສາມາດຢູ່ລອດ!",
                        description_job_EN: descriptions[0] || "",
                        description_money: translatedTexts[1] || "ຖ້າຫາກວ່າເຈົ້າຕ້ອງການທີ່ຈະມີລາຍໄດ້ເພີ່ມເຕີມເປັນໂອກາດທີ່ດີ. ເຈົ້າອາດຈະໄດ້ຮັບຄວາມໂຊກດີຈາກການລົງທຶນ, ການພະນັນ ຫຼື ການຄາດເດົາ, ແຕ່ເຈົ້າຄວນພິຈາລະນາຢ່າງລະມັດລະວັງ. ຖ້າ​ໃຫ້​ພີ່​ນ້ອງ​ທີ່​ໃກ້​ຊິດ​ແລະ​ຫມູ່​ເພື່ອນ​ ຫຼື ເພື່ອນບ້ານທີ່ຢູ່ໃກ້ກັນຢືມເງິນອາດຈະເປັນຜົນເສຍຫຼາຍກ່ວາ.",
                        description_money_EN: descriptions[1]|| "",
                        description_love: translatedTexts[2] || 'ຖ້າເຈົ້າເປັນຄົນເຮັດວຽກໜັກ ເຮັດວຽກຫຼາຍຈົນເກີນໄປ ບໍ່ໃຫ້ເວລາ ຫຼື ຄວາມສົນໃຈກັບຄົນທີ່ເຈົ້າຮັກ. ຄູ່ຄອງຫຼາຍເທົ່າທີ່ຄວນ ລະວັງວ່າອາດມີ "ມືທີສາມ" ເຂົ້າມາແຊກແຊງທີ່ອາດເຮັດໃຫ້ "ບ້ານແຕກ" ສຳລັບຄົນໂສດທີ່ກຳລັງເລີ່ມມີຄວາມຮັກກັບຄົນຕ່າງປະເທດ. ຖ້າ​ເລື່ອງ​ເງິນ​ຫຼື​ຄຳ​ມີ​ສ່ວນ​ກ່ຽວຂ້ອງ ເຈົ້າ​ຄວນ​ພິຈາລະນາ​ຢ່າງ​ຮອບຄອບ. ເພາະ​ຖ້າ​ເຈົ້າ​ບໍ່​ສົນ​ໃຈ​, ​ປິດ​ຕາ​ແລະ​ຫູ​ຂອງ​ເຈົ້າ​ໃຫ້​ທຸກ​ສິ່ງ​ທຸກ​ຢ່າງ​ທີ່​ເຈົ້າ​ມີ, ເຈົ້າອາດຈະລົ້ມລະລາຍຢ່າງໄວວາ!',
                        description_love_EN: descriptions[2]|| "",
                        description_health: translatedTexts[3] || "ຢູ່ໃນສະພາບທີ່ດີ ແຕ່ຖ້າໄປຕ່າງແຂວງ ຫຼື ຕ່າງປະເທດ ເຈົ້າຄວນລະວັງຄົນແປກໜ້າທີ່ເຂົ້າມາໃກ້ເຈົ້າ, ມາລະຍາດ, ຫຼືມີເພດສຳພັນ. ເພາະ​ວ່າ​ມັນ​ອາດ​ຈະ​ພາ​ໃຫ້​ມີ​ພະ​ຍາດ​ຮ້າຍ​ແຮງ.",
                        description_health_EN: descriptions[3] || "",
                        created_at: now
                    }
                })
                return create
            } catch (err) {
                throw err
            }

        })

        return response
    } catch (err) {
        throw err
    }

}

const getAllDailyHoroscopeService = async () => {

    try {

        const response = await prisma.daily_horoscope.findMany()

        return response

    } catch (err) {
        console.log("service error in get all daily horoscope");
        throw err
    }
}
const getByIdDailyHoroscopeService = async (bodyData) => {

    try {

        const response = await prisma.daily_horoscope.findFirst({
            where: {
                daily_horoscope_id: bodyData
            }
        });

        return response

    } catch (err) {

        throw err
    }
}
/**
 * Update Daily Horoscope Service
 * @param {Object} bodyData data to update daily horoscope
 * @param {Number} bodyData.lucky_number - The lucky number for the horoscope.
 * @param {String} bodyData.description_health - The description for health.
 * @param {String} bodyData.week_day - The day of the week for the horoscope.
 * @param {String} bodyData.lucky_color - The lucky color for the horoscope.
 * @param {String} bodyData.description_love - The description for love.
 * @param {String} bodyData.description_money - The description for money.
 * @param {Date} bodyData.start_date - The start date of the horoscope period.
 * @param {Date} bodyData.end_date - The end date of the horoscope period.
 * @return {Object} updated daily horoscope record
 * 
 */
const updateDailyHoroscopeService = async (bodyData) => {
    try {

        const response = await prisma.$transaction(async tx => {
            try {

                const update = await tx.daily_horoscope.update({
                    where: {
                        daily_horoscope_id: bodyData.daily_horoscope_id
                    },
                    data: {
                        lucky_number: bodyData.lucky_number,
                        description_health: bodyData.description_health,
                        week_day: bodyData.week_day,
                        lucky_color: bodyData.lucky_color,
                        description_love: bodyData.description_love,
                        description_money: bodyData.description_money,
                        start_date: bodyData.start_date,
                        end_date: bodyData.end_date
                    }
                })

                return update
            } catch (err) {
                throw err
            }

        })
        return response

    } catch (error) {
        throw err
    }
}

const deleteDailyHoroscopeService = async (id) => {
    try {

        const response = await prisma.$transaction(async tx => {
            try {

                const result = await tx.daily_horoscope.delete({
                    where: {
                        daily_horoscope_id: id
                    }
                })
                return result

            } catch (err) {
                throw err
            }

        })
        return response

    } catch (err) {
        console.log("sevice error in delete daily horoscope", err);
        throw err

    }
}

const deleteAllDaily = async () => {
    try {
        await prisma.$transaction(async tx => {
            try {
                await tx.daily_horoscope.deleteMany({
                    where: {
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
    createDailyHoroscopeService,
    getAllDailyHoroscopeService,
    getByIdDailyHoroscopeService,
    updateDailyHoroscopeService,
    deleteDailyHoroscopeService,
    deleteAllDaily
}