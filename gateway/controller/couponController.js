const couponService = require('../services/couponService');

const createCoupons = async (req, res) => {
    try {
        const { count, discount, expires_at, usage_limit } = req.body;

        if (!count || !discount || !expires_at || !usage_limit) {
            return res.status(400).json({
                message: "Required fields missing: count, discount, expires_at, usage_limit",
            });
        }

        const result = await couponService.createCoupons({ count, discount, expires_at, usage_limit });

        return res.status(201).json({
            message: `Successfully created ${result.count} coupons.`,
            couponsCreated: result.count,
        });
    } catch (error) {
        console.error("Controller error creating coupons:", error.message);
        return res.status(500).json({
            message: "Error creating coupons.",
            error: error.message,
        });
    }
};

const useCoupon = async (req, res) => {
    const { couponCode } = req.params;

    try {
        if (!couponCode) {
            return res.status(400).json({
                message: "Coupon code is required"
            });
        }

        const coupon = await couponService.useCoupon(couponCode);

        if (!coupon) {
            return res.status(404).json({
                message: 'Coupon not found or already used',
                success: false
            });
        }

        return res.status(200).json({
            data: {
                coupon: coupon
            },
            message: 'Coupon used successfully',
            success: true
        });

    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

const getCouponByCode = async (req, res) => {
    const { couponCode } = req.params;

    try {
        if (!couponCode) {
            return res.status(400).json({
                message: "Coupon code is required"
            });
        }

        const coupon = await couponService.getCouponByCode(couponCode);

        if (!coupon) {
            return res.status(404).json({
                message: 'Coupon not found or already used',
                success: false
            });
        }


        return res.status(200).json({
            data: {
                coupon: coupon
            },
            message: 'Coupon retrieved successfully',
            success: true
        });

    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};


const getAllCoupons = async (req, res) => {

    try {
        const coupons = await couponService.getAllCoupons();

        if (!coupons || coupons.length === 0) {
            return res.status(404).json({
                message: 'No coupons found',
                success: false
            });
        }

        return res.status(200).json({
            data: {
                coupons: coupons
            },
            message: 'Coupons retrieved successfully',
            success: true
        });

    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};


const getCouponsByDate = async (req, res) => {
    try {
        const { expired_at } = req.query; // Assuming the date is passed as a query parameter

        if (!expired_at) {
            return res.status(400).json({
                message: "Expired date is required."
            });
        }

        const coupons = await couponService.getAllCouponsByDate(expired_at);

        if (coupons.length === 0) {
            return res.status(404).json({
                message: "No coupons found for the specified expiration date."
            });
        }

        return res.status(200).json({
            message: "Coupons retrieved successfully.",
            coupons,
        });
    } catch (error) {
        console.error("Controller error retrieving coupons by date:", error.message);
        return res.status(500).json({
            message: "Error retrieving coupons.",
            error: error.message,
        });
    }
};


const deleteCouponById = async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) {
            return res.status(400).json({
                message: "Coupon ID is required"
            });
        }

        const coupon = await couponService.deleteCouponById(id);

        if (!coupon) {
            return res.status(404).json({
                message: 'Coupon not found',
                success: false
            });
        }

        return res.status(200).json({
            message: 'Coupon deleted successfully',
            success: true
        });

    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};


const deleteCouponsByDate = async (req, res) => {
    const { expires_at } = req.body; 
    try {
        if (!expires_at) {
            return res.status(400).json({
                message: "expires_at is required"
            });
        }

        await couponService.deleteCouponsByDate(expires_at);

        return res.status(200).json({
            message: 'Coupons deleted successfully',
            success: true
        });

    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};



module.exports = {
    createCoupons,
    useCoupon,
    getCouponByCode,
    getAllCoupons,
    getCouponsByDate,
    deleteCouponById,
    deleteCouponsByDate,
};
