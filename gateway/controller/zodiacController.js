const zodiacService = require('../services/zodiacService')
const {
    isValidUUID
} = require('../helper/helper.js')

const createZodiac = async (status, res) => {
    try {
        const zodiacSigns = [
            "Aries",
            "Taurus",
            "Gemini",
            "Cancer",
            "Leo",
            "Virgo",
            "Libra",
            "Scorpio",
            "Sagittarius",
            "Capricorn",
            "Aquarius",
            "Pisces"
        ];
        const results = [];
        let date;

        if (status === 1) { // createZodiacPerDay
            let nowDate = new Date();
            nowDate.setDate(nowDate.getDate() + 1);
            let date = nowDate.toISOString().split('T')[0];

            for (let i = 0; i < 12; i++) {
                const prompt = `Create a detailed horoscope for '${zodiacSigns[i]}' for tomorrow (${date}), considering love, career, and financially. For each section (love, career, and financially), provide a bolded numerical progress rating on a new line, followed by a detailed description. The format should be as follows: the section title, the bolded number on a new line, and then the description on another new line. Ensure there are numbers out of 100 or no slashes in the numbers , no extra tags, and do not include any links or additional advice.`
                const data = {
                    prompt: prompt,
                    zodiacSigns: zodiacSigns[i],
                    status: status
                };
                const zodiac = await zodiacService.createZodiac(data);
                results.push(zodiac);
            }
        } else if (status === 2) { // createZodiacPerWeek
            const startDate = new Date();
            startDate.setDate(startDate.getDate() + 1);

            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);

            date = `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`;
            for (let i = 0; i < 12; i++) {
                const prompt = `Create a detailed horoscope for '${zodiacSigns[i]}' for week (${date}), considering love, career, and financially. For each section (love, career, and financially), provide a bolded numerical progress rating on a new line, followed by a detailed description. The format should be as follows: the section title, the bolded number on a new line, and then the description on another new line. Ensure there are numbers out of 100 or no slashes in the numbers , no extra tags, and do not include any links or additional advice.`
                const data = {
                    prompt: prompt,
                    zodiacSigns: zodiacSigns[i],
                    status: status
                };
                const zodiac = await zodiacService.createZodiac(data);
                results.push(zodiac);
            }
        } else if (status === 3) { // createZodiacPerMonth
            date = `${new Date().getMonth() + 2} ${new Date().getFullYear()}`;
            for (let i = 0; i < 12; i++) {
                const prompt = `Create a detailed horoscope for '${zodiacSigns[i]}' for month (${date}), considering love, career, and financially. For each section (love, career, and financially), provide a bolded numerical progress rating on a new line, followed by a detailed description. The format should be as follows: the section title, the bolded number on a new line, and then the description on another new line. Ensure there are numbers out of 100 or no slashes in the numbers , no extra tags, and do not include any links or additional advice.`

                const data = {
                    prompt: prompt,
                    zodiacSigns: zodiacSigns[i],
                    status: status
                };
                const zodiac = await zodiacService.createZodiac(data);
                results.push(zodiac);
            }
        } else {
            throw new Error("Invalid request status");
        }

        return res.status(201).json({
            success: true,
            message: "zodiac created successfully👌",
            data: {
                zodiac: results
            }
        });

    } catch (error) {
        console.log("error", error);
        return {
            message: error.message
        };
    }
};




const getAllZodiac = async (req, res) => {
    try {
        const data = req.body
        const zodiac = await zodiacService.getAllZodiac(data)
        if (zodiac.length == 0) {
            return res.status(404).json({
                message: 'data not found',
                success: false
            });
        }
        const responseData = {
            zodiac: {
                zodiac_id: zodiac.zodiac_id,
                name: zodiac.name,
                description_money: zodiac.description_money,
                progress_money: zodiac.progress_love,
                description_job: zodiac.description_job,
                progress_job: zodiac.progress_job,
                description_love: zodiac.description_love,
                progress_love: zodiac.progress_love,
                lucky_number: zodiac.lucky_number,
                status: zodiac.status,
                description_money_EN: zodiac.description_money_EN,
                description_job_EN: zodiac.description_job_EN,
                description_love_EN: zodiac.description_love_EN
            },
            url_image: {
                star: zodiac.zodiac_image_id,
                logo: zodiac.zodiac_image_id
            }

        }
        return res.status(200).json({
            data: responseData,
            success: true,
            message: "Get zodiac success"
        });

    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            message: error.message
        })
    }

};


const getZodiacByZodiac = async (req, res) => {
    try {
        const zodiac = req.params.zodiac
        if (!zodiac) {
            return res.status(400).json({
                message: 'Invalid input'
            });
        }

        const zodiacData = await zodiacService.getZodiacByZodiac(zodiac)
        if (!zodiacData) {
            return res.status(404).json({
                message: 'data not found',
                success: false
            });
        } else {
            return res.status(200).json({
                data: {
                    zodiac: zodiacData
                },
                success: true,
                message: "Get zodiac success"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
};


const getZodiacById = async (req, res) => {
    try {
        const id = req.params.id

        if (!id) {
            return res.status(400).json({
                message: 'Invalid input'
            });
        }
        if (!isValidUUID(id)) {
            return res.status(400).json({
                message: "uuid is not collect"
            })
        }

        const zodiacData = await zodiacService.getZodiacById(id)

        if (!zodiacData) {
            return res.status(404).json({
                message: 'data not found',
                success: false
            });
        } else {
            return res.status(200).json({
                data: {
                    zodiac: zodiacData
                },
                success: true,
                message: "Get zodiac success"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
};


module.exports = {
    createZodiac,
    getAllZodiac,
    getZodiacByZodiac,
    getZodiacById,
};