import db from "./src/config/db.js";

async function checkSchema() {
    try {
        const [rows] = await db.query("DESC orders");
        console.log("Orders table schema:");
        rows.forEach(row => {
            console.log(`${row.Field} - ${row.Type}`);
        });
        process.exit(0);
    } catch (error) {
        console.error("Error checking schema:", error);
        process.exit(1);
    }
}

checkSchema();
