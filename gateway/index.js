const express = require('express');
const prisma = require("./utils/prisma.js");
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
const cors = require('cors')
require('dotenv').config();
const {
    specs,
    swaggerUi
} = require('./utils/swagger');
const {
    default: axios
} = require('axios');


const {
    deleteExpiredCoupons
} = require('./services/couponService');


const dailyHoroscopeController = require('./controller/dailyHoroscopeController')
const { deleteAllDaily } = require('./services/dailyHoroscopeService.js')
const zodiacController = require('./controller/zodiacController.js')
const { deleteAllZodiac } = require('./services/zodiacService.js')
const { clearOtp } = require('./controller/loginController.js')


const bodyParser = require('body-parser');



const middleware = require('./middleware/authenticateToken')
const routeLogin = require('./routes/loginRoute');
const routePersonal = require('./routes/personal');
const routeZodiac = require('./routes/zodiac');
const routeTel = require('./routes/telephone');
const routeWallpaper = require('./routes/wallpaper');
const dailyHoroscope = require('./routes/dailyHoroscopeRoute')
const routeCoupon = require('./routes/coupon');
const routeImage = require('./routes/image.js');
const logoDaily = require('./routes/logoDailyHoroscope.js');
const imageZodiac = require('./routes/imageZodiac.js')







const app = express();
const limiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes"
});


// Middleware to handle large Base64 payloads
app.use(bodyParser.json({
    limit: '100mb'
})); // Increase limit
app.use(bodyParser.urlencoded({
    limit: '100mb',
    extended: true
}));

app.use(cors({
    credentials: true,
    // origin: ['http://localhost:3000/'],
    origin: true
}))
app.use(limiter)
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

app.use("/api/v1.0", limiter, routeLogin);
app.use("/api/v1.0", routePersonal);
app.use("/api/v1.0", imageZodiac);
app.use("/api/v1.0", routeImage);

app.use("/api/v1.0", routeZodiac);

app.use("/api/v1.0", routeTel);

app.use("/api/v1.0", routeWallpaper);
app.use("/api/v1.0", routeCoupon);
app.use("/api/v1.0", dailyHoroscope);
app.use("/api/v1.0", logoDaily);



// Schedule a task to run everyday at night (23:00)
cron.schedule('0 23 * * *', () => {
    zodiacController.createZodiac(1)
});

// Schedule a task to run every Sunday at night (23:00)
cron.schedule('0 23 * * 0', () => {
    dailyHoroscopeController.create()
    zodiacController.createZodiac(2)
});

// check last day of month 
function isLastDayOfMonth() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    console.log(tomorrow);
    return tomorrow.getDate() === 1;
  }
// Schedule a task to run every lastday of month at night (23:00)
cron.schedule('0 23 28-31 * *', () => {
    if (isLastDayOfMonth()) {
        zodiacController.createZodiac(3)
    }
});



////clear database
// Schedule a task to run everyday at midnight (00:00)
cron.schedule('0 0 * * *', () => {
    deleteAllZodiac(1)
    deleteExpiredCoupons();
});

// Schedule a task to run every Monday at midnight (00:00)
cron.schedule('0 0 * * 1', () => {
    clearOtp()
    deleteAllZodiac(2)
    deleteAllDaily()
});

// Schedule a task to run every 1st at midnight (00:00)
cron.schedule('0 0 1 * *', () => {
    deleteAllZodiacPerMonth(3)
});

const wallpaperController = require('./controller/wallpaperController.js')


app.get('/getImage', wallpaperController.createWallpaper)

const multer = require('multer');
const upload = multer(); // Set up multer to handle file uploads

app.post('/upload-logo', upload.single('logo_file'), async (req, res) => {
    try {
        const { week_day } = req.body;
        const logo_file = req.file; // Access the uploaded file



        // Convert file buffer to binary
        const logoBuffer = logo_file.buffer;

        // Store the image and week_day in the database
        const newLogo = await prisma.logo_daily.create({
            data: {
                week_day: week_day,
                logo_file: logoBuffer
            }
        });

        // Send success response
        res.status(201).json({
            success: true,
            message: 'Logo uploaded successfully',
            logo_daily_id: newLogo.logo_daily_id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/upload-image-zodiac', upload.fields([{ name: 'zodiac_logo' }, { name: 'star_zodiac' }]), async (req, res) => {
    try {
        const { name } = req.body;
        const { zodiac_logo, star_zodiac } = req.files; // req.files is an object if using upload.fields

        if (!zodiac_logo || !star_zodiac) {
            return res.status(400).json({ error: 'Both zodiac_logo and star_zodiac are required' });
        }

        // Convert file buffer to binary (buffer contains the image data)
        const zodiacLogoBuffer = zodiac_logo[0].buffer; // Accessing first file buffer for each field
        const starZodiacBuffer = star_zodiac[0].buffer;

        // Store the image and week_day in the database
        const newLogo = await prisma.zodiac_image.create({
            data: {
                name: name,
                zodiac_logo: zodiacLogoBuffer, // Storing the file buffer
                star_zodiac: starZodiacBuffer
            }
        });

        // Send success response
        res.status(201).json({
            success: true,
            message: 'Logo uploaded successfully',
            logo_daily_id: newLogo.logo_daily_id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = app