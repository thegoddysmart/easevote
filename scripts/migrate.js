const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");

// Load .env
const envPath = path.join(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  content.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let val = match[2] || "";
      // Remove quotes if present
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      process.env[key] = val;
    }
  });
  console.log("Loaded .env file");
} else {
  console.log("No .env file found");
}

try {
  console.log("Running prisma db push...");
  const output = execSync("npx prisma db push --accept-data-loss", {
    env: process.env,
    encoding: "utf8",
  });
  console.log(output);
} catch (e) {
  console.error("Migration Failed:");
  console.error(e.stdout);
  console.error(e.stderr);
  process.exit(1);
}
