const cron = require('node-cron');
const { deleteExpiredCoupons } = require('./services/couponService');

// Schedule the cron job to run every day at midnight
cron.schedule('0 0 * * *', async () => {
    console.log('Running daily job to delete expired coupons');
    try {
        await deleteExpiredCoupons();
        console.log('Expired coupons deleted successfully');
    } catch (error) {
        console.error('Error deleting expired coupons:', error.message);
    }
});

module.exports = cron;
