import pool from "../../config/db.js";
import { sendNotification } from "../../utils/sendNotification.js";

export const reserveTable = async (req, res) => {
  const {
    user_id, // restaurant owner id
    customer_id, // customer id
    customer_name,
    customer_phone,
    customer_email,
    table_number,
    party_size,
    reservation_date,
    reservation_time,
    duration_minutes,
    special_requests,
    notes
  } = req.body;

  if (!customer_name || !reservation_date || !reservation_time) {
    return res.status(400).json({ status: 0, message: "Required fields are missing." });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO table_reservations 
      (user_id, customer_id, customer_name, customer_phone, customer_email, table_number, party_size, reservation_date, reservation_time, duration_minutes, special_requests, status, notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [
        user_id || null, // restaurant owner id
        customer_id || null, // customer id
        customer_name,
        customer_phone || null,
        customer_email || null,
        table_number || null,
        party_size || 1,
        reservation_date,
        reservation_time,
        duration_minutes || 60,
        special_requests || null,
        notes || null
      ]
    );

    // ✅ NOTIFY RESTAURANT
    try {
      if (user_id) {
        await sendNotification({
          userType: "restaurant",
          userId: user_id,
          title: "🍽️ New Table Reservation",
          body: `${customer_name} has requested a table for ${party_size} persons.`,
          data: { type: "NEW_RESERVATION", table: String(table_number || ""), res_id: String(result.insertId) }
        });
      }
    } catch (e) {
      console.error("Restaurant notification failed:", e.message);
    }

    res.status(201).json({
      status: 1,
      message: "Table reservation submitted successfully.",
      reservation_id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ status: 0, message: "Internal server error." });
  }
};

export const getReservationSettings = async (req, res) => {
  const { user_id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM table_reservation_settings WHERE user_id = ?",
      [user_id]
    );

    if (rows.length === 0) {
      // Default to disabled if not configured
      return res.json({ status: 1, data: { is_enabled: 0, monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0, sunday: 0 } });
    }

    res.json({ status: 1, data: rows[0] });
  } catch (error) {
    console.error("Error in getReservationSettings (API):", error);
    res.status(500).json({ status: 0, message: "Internal server error." });
  }
};
