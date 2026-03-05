import { getSettingsModel } from "../../models/SettingsModel.js";

export const getAppSettings = async (req, res) => {
    try {
        const settings = await getSettingsModel();

        // Only send public fields to the mobile app
        const data = {
            signup_bonus_amount: settings?.signup_bonus_amount || 0,
            referral_bonus_amount: settings?.referral_bonus_amount || 0,
            earn_per_order_amount: settings?.earn_per_order_amount || 0,
            minimum_order: settings?.minimum_order || 0,
            minimum_cart_total: settings?.minimum_cart_total || 0,
        };

        return res.json({
            status: 1,
            message: "App settings fetched successfully",
            data,
        });
    } catch (err) {
        console.error("getAppSettings error:", err);
        return res.status(500).json({
            status: 0,
            message: "Failed to fetch app settings",
            error: err.message
        });
    }
};
