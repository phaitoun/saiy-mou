const {
    getLoGobyId
} = require('../services/logo_dailyHoroScopeService')
const getLoGoByIdController = async (req, res) => {
    const logo_daily_id = req.params.logo_daily_id

    try {

        if(!logo_daily_id){
            return res.status(400).json({
                success: false,
                message: "id is required"
            })
        }
        const getImageByte = await getLoGobyId(logo_daily_id)
        const imageBuffer = Buffer.from(getImageByte.logo_file); 

        res.setHeader('Content-Type', 'image/png');

        // Send the image buffer as the response    
       return res.send(imageBuffer);

    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success: false,
            message: "server"
        })
    }

}

module.exports ={
    getLoGoByIdController
}