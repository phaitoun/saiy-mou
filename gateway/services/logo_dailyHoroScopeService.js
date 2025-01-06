const prisma = require("../utils/prisma.js");

const getLoGobyId = async (logo_daily_id) => {

    const response = await prisma.logo_daily.findFirst({
        where: {
            logo_daily_id: logo_daily_id
        }
    })
    return response

}

module.exports ={
    getLoGobyId
}