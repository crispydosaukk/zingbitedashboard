import pool from "./src/config/db.js";

async function run() {
  try {
    const conn = await pool.getConnection();
    console.log("Creating Promotional Offers tables...");

    // 1. Create promotional_offers table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS promotional_offers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        banner_image VARCHAR(255),
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("Table 'promotional_offers' ensured.");

    // 2. Create offer_targets table (for linking categories and products)
    await conn.query(`
      CREATE TABLE IF NOT EXISTS offer_targets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        offer_id INT NOT NULL,
        target_type ENUM('category', 'product') NOT NULL,
        target_id INT NOT NULL,
        FOREIGN KEY (offer_id) REFERENCES promotional_offers(id) ON DELETE CASCADE
      )
    `);
    console.log("Table 'offer_targets' ensured.");

    conn.release();
    process.exit(0);
  } catch (err) {
    console.error("Error creating tables:", err);
    process.exit(1);
  }
}

run();
