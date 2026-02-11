import db from "./src/config/db.js";

async function addColumn() {
    try {
        await db.query("ALTER TABLE orders ADD COLUMN order_source VARCHAR(50) DEFAULT 'App'");
        console.log("Column order_source added successfully");
        process.exit(0);
    } catch (error) {
        console.error("Error adding column:", error);
        process.exit(1);
    }
}

addColumn();
