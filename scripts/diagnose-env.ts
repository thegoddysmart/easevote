import "dotenv/config";

async function main() {
  const url = process.env.DATABASE_URL;
  if (url) {
    try {
      // Basic parsing (might fail if complex)
      const parts = url.split("@");
      const hostPort = parts[1].split("/")[0];
      console.log(`HOST: ${hostPort}`);
    } catch (e) {
      console.log("HOST: PARSE_ERROR");
    }
  }
}

main();
