
import pool from "c:/Users/rahul/OneDrive/Desktop/dashboardtesting-main/backend/src/config/db.js";
import fs from "fs";

async function check() {
    try {
        const [rows] = await pool.query("SELECT id, user_id, restaurant_name, stripe_secret_key FROM restaurant_details");
        let out = "RESTAURANTS IN DB:\n";
        rows.forEach(r => {
            out += `ID: ${r.id}, UserID: ${r.user_id}, Name: ${r.restaurant_name}, Secret: ${r.stripe_secret_key ? 'YES (length: ' + r.stripe_secret_key.length + ')' : 'NO'}\n`;
        });
        fs.writeFileSync("db_status.txt", out);
        console.log("DB status written to db_status.txt");
        process.exit(0);
    } catch (e) {
        fs.writeFileSync("db_status.txt", "DB Error: " + e.message);
        process.exit(1);
    }
}

check();
