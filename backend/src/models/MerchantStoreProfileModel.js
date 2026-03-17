import pool from "../config/db.js";

export async function createMerchantStoreProfile(payload) {
  const conn = await pool.getConnection();
  try {
    const [res] = await conn.query(
      `INSERT INTO merchant_store_profiles 
      (user_id, first_name, surname, email, country_code, mobile_number, landline_number, store_address, 
      floor_suite, store_name, brand_name, business_type, cuisine_type, 
      number_of_locations, social_media_website_link, status,
      food_business_license, food_hygiene_certificate, business_registration_certificate, vat_registration_number,
      owner_id_proof_type, owner_id_proof_file, bank_account_name, bank_account_number, bank_sort_code, bank_statement_file,
      address_proof_type, address_proof_file, food_hygiene_rating, allergen_info_file, is_halal) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.user_id,
        payload.first_name,
        payload.surname,
        payload.email,
        payload.country_code,
        payload.mobile_number,
        payload.landline_number || null,
        payload.store_address,
        payload.floor_suite || null,
        payload.store_name,
        payload.brand_name,
        payload.business_type,
        payload.cuisine_type,
        payload.number_of_locations,
        payload.social_media_website_link || null,
        payload.food_business_license || null,
        payload.food_hygiene_certificate || null,
        payload.business_registration_certificate || null,
        payload.vat_registration_number || null,
        payload.owner_id_proof_type || null,
        payload.owner_id_proof_file || null,
        payload.bank_account_name || null,
        payload.bank_account_number || null,
        payload.bank_sort_code || null,
        payload.bank_statement_file || null,
        payload.address_proof_type || null,
        payload.address_proof_file || null,
        payload.food_hygiene_rating || null,
        payload.allergen_info_file || null,
        payload.is_halal || 0
      ]
    );
    return res.insertId;
  } finally {
    conn.release();
  }
}

export async function getProfileByUserId(userId) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT * FROM merchant_store_profiles WHERE user_id = ? LIMIT 1",
      [userId]
    );
    return rows[0] || null;
  } finally {
    conn.release();
  }
}

export async function getAllMerchantStoreProfiles() {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query("SELECT * FROM merchant_store_profiles ORDER BY created_at DESC");
    return rows;
  } finally {
    conn.release();
  }
}

export async function updateMerchantProfile(userId, payload) {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      `UPDATE merchant_store_profiles SET 
      first_name = ?, surname = ?, email = ?, country_code = ?, mobile_number = ?, 
      landline_number = ?, store_address = ?, floor_suite = ?, store_name = ?, 
      brand_name = ?, business_type = ?, cuisine_type = ?, number_of_locations = ?, 
      social_media_website_link = ?, updated_at = NOW(),
      food_business_license = ?, food_hygiene_certificate = ?, business_registration_certificate = ?, 
      vat_registration_number = ?, owner_id_proof_type = ?, owner_id_proof_file = ?, 
      bank_account_name = ?, bank_account_number = ?, bank_sort_code = ?, 
      bank_statement_file = ?, address_proof_type = ?, address_proof_file = ?, 
      food_hygiene_rating = ?, allergen_info_file = ?, is_halal = ?
      WHERE user_id = ?`,
      [
        payload.first_name,
        payload.surname,
        payload.email,
        payload.country_code,
        payload.mobile_number,
        payload.landline_number || null,
        payload.store_address,
        payload.floor_suite || null,
        payload.store_name,
        payload.brand_name,
        payload.business_type,
        payload.cuisine_type,
        payload.number_of_locations,
        payload.social_media_website_link || null,
        payload.food_business_license || null,
        payload.food_hygiene_certificate || null,
        payload.business_registration_certificate || null,
        payload.vat_registration_number || null,
        payload.owner_id_proof_type || null,
        payload.owner_id_proof_file || null,
        payload.bank_account_name || null,
        payload.bank_account_number || null,
        payload.bank_sort_code || null,
        payload.bank_statement_file || null,
        payload.address_proof_type || null,
        payload.address_proof_file || null,
        payload.food_hygiene_rating || null,
        payload.allergen_info_file || null,
        payload.is_halal || 0,
        userId
      ]
    );
    return true;
  } finally {
    conn.release();
  }
}

export async function updateMerchantStatus(profileId, status, rejectionReason = null) {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      "UPDATE merchant_store_profiles SET status = ?, rejection_reason = ? WHERE id = ?",
      [status, rejectionReason, profileId]
    );
    return true;
  } finally {
    conn.release();
  }
}

export async function getSuperAdminIds() {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query("SELECT id FROM users WHERE role_id = 6");
    return rows.map(r => r.id);
  } finally {
    conn.release();
  }
}

export async function createNotification(userId, userType, title, body, linkId = null) {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      "INSERT INTO notifications (user_id, user_type, title, body, is_read, order_number) VALUES (?, ?, ?, ?, 0, ?)",
      [userId, userType, title, body, linkId]
    );
  } finally {
    conn.release();
  }
}

export async function markMerchantNotificationsAsRead(linkId) {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      "UPDATE notifications SET is_read = 1 WHERE order_number = ? AND user_type = 'admin'",
      [linkId]
    );
  } finally {
    conn.release();
  }
}
