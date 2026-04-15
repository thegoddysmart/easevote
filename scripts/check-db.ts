import "dotenv/config";
import db from "../lib/db";

async function main() {
  try {
    console.log("Connecting...");
    console.log("URL:", process.env.DATABASE_URL);
    const count = await db.user.count();
    console.log(`Connection successful. User count: ${count}`);
  } catch (e) {
    console.error("Connection failed:", e);
  }
}

main();
