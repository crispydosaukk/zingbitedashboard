import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

/**
 * MIGRATION: Add 'status' column to customers table.
 * 1 = Active (Default)
 * 0 = Deactivated / Deleted
 */

async function migrate() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST || "127.0.0.1",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "zingbite",
    });

    try {
        console.log("Checking for 'status' column in 'customers' table...");
        const [columns] = await db.execute("SHOW COLUMNS FROM customers LIKE 'status'");
        
        if (columns.length === 0) {
            console.log("Adding 'status' column...");
            await db.execute("ALTER TABLE customers ADD COLUMN status TINYINT(1) DEFAULT 1;");
            console.log("Success: 'status' column added.");
        } else {
            console.log("Info: 'status' column already exists.");
        }
    } catch (err) {
        console.error("Migration FAILED:", err.message);
    } finally {
        await db.end();
    }
}

migrate();
