const prisma = require('../utils/prisma.js');

const generateRandomBaseCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a random 6-digit number
};

const createCoupons = async (data) => {
    try {
        const coupons = await prisma.$transaction(async tx => {
            try {
                const couponData = [];

                for (let i = 0; i < data.count; i++) {
                    const baseCode = generateRandomBaseCode(); // Generate a random base code

                    couponData.push({
                        code: `${baseCode}`,  // Use the random base code as the coupon code
                        discount: data.discount,
                        expires_at: new Date(data.expires_at),
                        isActive: true,
                        usage_limit: data.usage_limit, // Set usage limit, default to 10 if not provided
                        use_count: 0, // Set usage limit, default to 10 if not provided
                    });
                }

                const result = await tx.coupon.createMany({
                    data: couponData,
                    skipDuplicates: true // Optional: Skip if a coupon with the same code already exists
                });

                return result;
            } catch (error) {
                console.error(error.message);
                throw error;
            }
        });

        return coupons;
    } catch (error) {
        console.error("Service error creating multiple coupons:", error.message);
        throw error;
    }
};

const useCoupon = async (couponCode) => {
    try {
        const coupon = await prisma.$transaction(async tx => {
            try {
                // Check if the coupon exists and is active
                const existingCoupon = await tx.coupon.findFirst({
                    where: {
                        code: couponCode,
                        isActive: true
                    }
                });

                if (!existingCoupon) {
                    return false
                }

                // Increment the use count
                const updatedCoupon = await tx.coupon.update({
                    where: { coupon_id: existingCoupon.coupon_id },
                    data: { use_count: existingCoupon.use_count + 1 },
                });

                // Check if the coupon has been used 10 times
                if (updatedCoupon.use_count > 10) {
                    await tx.coupon.delete({
                        where: { coupon_id: existingCoupon.coupon_id },
                    });

                    return { success: true, message: "Coupon has been used 10 times and is now deleted." };
                }

                return { success: true, message: "Coupon used successfully.", coupon: updatedCoupon };
            } catch (error) {
                console.error(error.message);
                throw error;
            }
        });

        return coupon;
    } catch (error) {
        console.error("Service error using coupon:", error.message);
        throw error;
    }
};



const getCouponByCode = async (couponCode) => {
    try {
        const coupon = await prisma.$transaction(async tx => {
            try {
                const existingCoupon = await tx.coupon.findFirst({
                    where: {
                        code: couponCode,
                        isActive: true
                    }
                });

                if (!existingCoupon) {
                    return false
                }

                return existingCoupon;
            } catch (error) {
                console.error(error.message);
                throw error;
            }
        });

        return coupon;
    } catch (error) {
        console.error("Service error using coupon:", error.message);
        throw error;
    }
};


const getAllCoupons = async () => {
    try {
        const coupons = await prisma.coupon.findMany(); // Retrieve all coupons
        return coupons
    } catch (error) {
        console.error("Service error retrieving all coupons:", error.message);
        throw error;
    }
};


const getAllCouponsByDate = async (data) => {
    try {
        const coupons = await prisma.coupon.findMany({
            where: {
                expires_at: {
                    equals: data.expired_at
                }
            }
        }); 
        return coupons
    } catch (error) {
        console.error("Service error retrieving all coupons:", error.message);
        throw error;
    }
};


const deleteCouponById = async (id) => {
    try {
        const coupon = await prisma.$transaction(async tx => {
            try {
                const result = await tx.coupon.delete({
                    where: { coupon_id: id },
                });

                return result;
            } catch (error) {
                console.error(error.message);
                throw error;
            }
        });
        
        return coupon;
    } catch (error) {
        console.error("Service error deleting coupon:", error.message);
        throw error;
    }
};


const deleteCouponsByDate = async (data) => {
    try {
        await prisma.$transaction(async tx => {
            try {
                await tx.coupon.deleteMany({
                    where: {
                        expires_at: {
                            equals: data.expired_at
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


const deleteExpiredCoupons = async () => {
    try {
        
        const now = new Date();
        now.setHours(now.getHours() + 7);
        
        await prisma.$transaction(async tx => {
            try {
                await tx.coupon.deleteMany({
                    where: {
                        expires_at: {
                            lte: now
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
    createCoupons,
    useCoupon,
    getCouponByCode,
    getAllCoupons,
    getAllCouponsByDate,
    deleteCouponById,
    deleteCouponsByDate,
    deleteExpiredCoupons
};
