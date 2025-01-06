const prisma = require("../utils/prisma.js");
const {

    createDailyHoroscopeService,
    getAllDailyHoroscopeService,
    getByIdDailyHoroscopeService,
    updateDailyHoroscopeService,
    deleteDailyHoroscopeService

} = require('../services/dailyHoroscopeService.js')

const {
    isValidUUID
} = require('../helper/helper.js')

const create = async (req, res) => {
    const options = { weekday: 'long' };

    // Create an array with 7 days
    const daysOfWeek = [...Array(7)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return date.toLocaleDateString('en-US', options);
    });

    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 6);
    daysOfWeek.push(`${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);

    try {
        const results = [];
        for (let i = 0; i < 7; i++) {
            const data = {
                dayOfWeek: daysOfWeek[i],
                day: daysOfWeek[7]
            };

            const response = await createDailyHoroscopeService(data);
            results.push(response);
        }

        // return res.status(201).json({
        //     success: true,
        //     message: "Daily horoscopes created successfully👌",
        //     data: results
        // });

    } catch (err) {
        console.log("controller error: ", err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const getAll = async (req, res) => {

    try {

        const response = await getAllDailyHoroscopeService()

        if (response.length == 0) {

            return res.status(404).json({
                success: true,
                message: "do not have any data",
                data: {}
            })
        }

        return res.status(200).json({
            success: true,
            message: "Query success",
            data: response
        })
    } catch (err) {
        console.log("controller error at get daily horoscope");
        return res.status(500).json({
            success: false,
            message: "server error"
        })
    }

}
const getById = async (req, res) => {

    const daily_horoscope_id = req.params.id

    try {

        if (!daily_horoscope_id) {
            return res.status(400).json({
                success: false,
                message: "id must be provide",
                data: {}
            })
        }
        if (!isValidUUID(daily_horoscope_id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid UUID format",
                data: {}
            });
        }
        const response = await getByIdDailyHoroscopeService(daily_horoscope_id)

        if (!response) {
            return res.status(400).json({
                success: false,
                message: "invalid id or not found",
                data: {}
            })
        }
        return res.status(200).json({
            success: true,
            message: "get data success",
            data: response
        })
    } catch (error) {
        console.log("controller error", error);
        res.status(500).json({
            success: false,
            message: "server error",
            data: {}
        })

    }
}

const update = async (req, res) => {
    try {

        const {
            week_day,
            lucky_number,
            description_love,
            description_money,
            description_health,
            lucky_color,
            start_date,
            end_date

        } = req.body

        const id = req.params.id

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "id must be provide",
                data: {}
            })
        }
        if (!isValidUUID(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid UUID format",
                data: {}
            });
        }
        const isCheck = await prisma.daily_horoscope.findFirst({
            where: {
                daily_horoscope_id: id
            }
        })

        if (!isCheck) {
            return res.status(400).json({
                success: false,
                message: "invalid id or not found",
                data: {}
            })
        }
        if (!week_day || !lucky_number || !description_love || !description_money || !description_health || !lucky_color || !start_date || !end_date) {

            return res.status(400).json({
                success: false,
                message: "please fill data before enter"
            })
        };

        const bodyData = {
            daily_horoscope_id: id,
            week_day: week_day,
            lucky_number: lucky_number,
            description_love: description_love,
            description_money: description_money,
            description_health: description_health,
            lucky_color: lucky_color,
            start_date: start_date,
            end_date: end_date
        }
        const response = await updateDailyHoroscopeService(bodyData)

        return res.status(200).json({
            success: true,
            message: "get data success",
            data: response
        })
    } catch (err) {
        console.log("controller error update daily horoscope", err);
        return res.status(500).json({
            success: false,
            message: "server error",
            data: {}
        })

    }
}

const deleteDailyHoroscope = async (req, res) => {
    try {

        const id = req.params.id

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "id must be provide",
                data: {}
            })
        }
        if (!isValidUUID(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid UUID format",
                data: {}
            });
        }
        const isCheck = await prisma.daily_horoscope.findFirst({
            where: {
                daily_horoscope_id: id
            }
        })

        if (!isCheck) {
            return res.status(400).json({
                success: false,
                message: "invalid id or  data not found",
                data: {}
            })
        }

        const response = await deleteDailyHoroscopeService(id)

        return res.status(200).json({
            success: true,
            message: "delete is successfully",
            data: response
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Server error",
            data: {}
        })

    }
}
module.exports = {
    create,
    getAll,
    getById,
    update,
    deleteDailyHoroscope
}