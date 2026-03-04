import Stripe from "stripe";
import db from "../../config/db.js";

const getStripeKeys = async (restaurant_id) => {
  if (restaurant_id) {
    try {
      const [rows] = await db.query(
        "SELECT id, user_id, restaurant_name, stripe_secret_key, stripe_publishable_key FROM restaurant_details WHERE id = ? OR user_id = ? ORDER BY (stripe_secret_key IS NOT NULL) DESC, id ASC LIMIT 2",
        [restaurant_id, restaurant_id]
      );

      if (rows.length) {
        const bestMatch = rows[0];

        if (bestMatch.stripe_secret_key) {
          return {
            secret: bestMatch.stripe_secret_key,
            publishable: bestMatch.stripe_publishable_key
          };
        }
      }
    } catch (e) {
      console.error("Stripe keys DB error:", e);
    }
  }

  if (restaurant_id) {
    const envSecret = process.env[`RESTAURANT_${restaurant_id}_STRIPE_SECRET`];
    const envPub = process.env[`RESTAURANT_${restaurant_id}_STRIPE_PUBLISHABLE`];
    if (envSecret) {
      return {
        secret: envSecret,
        publishable: envPub
      };
    }
  }

  return { secret: null, publishable: null };
};

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = "gbp", restaurant_id } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        status: 0,
        message: "Invalid amount",
      });
    }

    const { secret, publishable } = await getStripeKeys(restaurant_id);

    if (!secret) {
      return res.status(500).json({
        status: 0,
        message: "Stripe is not configured (missing secret key)",
      });
    }

    const stripeInstance = new Stripe(secret, {
      apiVersion: "2023-10-16",
    });

    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: Math.round(amount * 100), // pounds → pence
      currency,
      automatic_payment_methods: { enabled: true },
    });

    return res.json({
      status: 1,
      clientSecret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
      publishableKey: publishable
    });
  } catch (error) {
    console.error("Stripe error:", error);
    return res.status(500).json({
      status: 0,
      message: error.message || "Stripe error",
    });
  }
};

/**
 * GET /api/stripe/restaurant-key?restaurant_id=<id>
 * Returns only the publishable key for a restaurant (safe to expose to mobile/frontend).
 * NEVER returns the secret key.
 */
export const getRestaurantStripeKey = async (req, res) => {
  try {
    const { restaurant_id } = req.query;

    if (!restaurant_id) {
      return res.status(400).json({ status: 0, message: "restaurant_id is required" });
    }

    const { publishable } = await getStripeKeys(restaurant_id);

    if (!publishable) {
      return res.json({
        status: 0,
        message: "Stripe publishable key not found/configured",
        publishableKey: null
      });
    }

    return res.json({
      status: 1,
      publishableKey: publishable,
    });
  } catch (error) {
    console.error("getRestaurantStripeKey error:", error);
    return res.status(500).json({ status: 0, message: "Server error" });
  }
};
