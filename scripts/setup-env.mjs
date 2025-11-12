// scripts/setup-env.mjs
import fs from "fs";
import path from "path";
import readline from "readline";
import mysql from "mysql2/promise";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, (answer) => resolve(answer.trim())));
}

async function maybeCreateDatabase({ dbHost, dbUser, dbPassword, dbName /*, sslConfig*/ }) {
  const createDbAnswer = await ask(
    `Do you want me to create the database "${dbName}" for you now? (y/N): `
  );

  if (!/^y(es)?$/i.test(createDbAnswer)) {
    console.log("ℹ️ Skipping database creation.");
    return;
  }

  console.log("\n🛠 Connecting to database server...");

  try {
    const connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      multipleStatements: true,
      // If you later want SSL here too, you can uncomment and pass sslConfig:
      // ...(sslConfig ? { ssl: sslConfig } : {}),
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.query(`USE \`${dbName}\`;`);
    console.log(`✅ Database "${dbName}" is ready.`);

    const schemaPath = path.join("db", "schema.sql");
    if (fs.existsSync(schemaPath)) {
      console.log(`🗂 Found schema file at ${schemaPath}. Applying schema...`);
      const schemaSql = fs.readFileSync(schemaPath, "utf8");

      const statements = schemaSql
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const stmt of statements) {
        await connection.query(stmt);
      }

      console.log("✅ Database schema applied successfully.");
    } else {
      console.log("ℹ️ No db/schema.sql file found. Skipping table creation.");
    }

    const [rows] = await connection.query("SELECT VERSION() AS version;");
    console.log(`🧩 Connected to DB engine: ${rows[0].version}`);

    await connection.end();
  } catch (err) {
    console.error(`❌ Database connection or creation failed: ${err.message}`);
  }
}

async function main() {
  console.log("🧙‍♂️ Welcome to the Env Setup Wizard\n");

  // 🌐 General app config
  const businessName =
    (await ask("Business name (e.g. TechEase Repairs): ")) || "Business Name";
  const businessTagline =
    (await ask("Business tagline (e.g. Tech Repair Made Simple.): ")) ||
    "Tech Repair Made Simple.";
  // 🌐 Frontend API URL (accepts full URL or just IP/host)
  const apiInput = await ask(
    "Frontend API URL [http://localhost:5000 or just IP/host]: "
  );

  let apiUrl;

  if (!apiInput) {
    // User just pressed Enter → default
    apiUrl = "http://localhost:5000";
  } else if (/^https?:\/\//i.test(apiInput)) {
    // User entered full URL → use as-is
    apiUrl = apiInput;
  } else {
    // User entered just IP/hostname → build full URL
    const cleanHost = apiInput.replace(/\/+$/g, ""); // strip trailing slashes
    apiUrl = `http://${cleanHost}:5000`;
  }

  console.log("➡ Using API URL:", apiUrl);


  console.log("\n🗄️ Database Configuration\n");

  // 🏠 Ask local or remote
  const dbType = (await ask("Is your database local or remote? (local/remote) [local]: ")) || "local";
  let dbHost;

  if (dbType.toLowerCase() === "remote") {
    dbHost = await ask("Enter remote DB host (e.g. db.example.com): ");
  } else {
    dbHost = "127.0.0.1";
    console.log("ℹ️ Using local host 127.0.0.1");
  }

  const dbUser = (await ask("DB user [root]: ")) || "root";
  const dbPassword = await ask("DB password: ");
  const dbName = (await ask("DB name [test]: ")) || "test";

  // 🔐 Optional SSL config
  console.log("\n🔐 SSL Configuration (optional)\n");
  const sslAnswer = (await ask("Do you want to configure SSL for the database? (y/N): ")).toLowerCase();

  let sslEnvBlock = "";
  // Optional: if you ever want to also use SSL in maybeCreateDatabase, you can build sslConfig here
  // let sslConfig = null;

  if (/^y(es)?$/.test(sslAnswer)) {
    console.log("\nPlease enter the paths to your MariaDB SSL files.");

    // You can either ask for each file explicitly...
    const sslCa = await ask("Path to CA file (DB_SSL_CA), e.g. /etc/mysql/ssl/mariadb-ca.crt: ");
    const sslCert = await ask("Path to client cert file (DB_SSL_CERT), e.g. /etc/mysql/ssl/mariadb.crt: ");
    const sslKey = await ask("Path to client key file (DB_SSL_KEY), e.g. /etc/mysql/ssl/mariadb.key: ");

    sslEnvBlock = `
DB_SSL_CA=${sslCa}
DB_SSL_CERT=${sslCert}
DB_SSL_KEY=${sslKey}
`.trim();

    // If you wanted to use this for the wizard's own connection:
    // sslConfig = {
    //   ca: fs.readFileSync(sslCa),
    //   cert: fs.readFileSync(sslCert),
    //   key: fs.readFileSync(sslKey),
    // };
  }

  console.log("\n📧 Email Configuration\n");
  const smtpEmail = await ask("SMTP email (for sending confirmations): ");
  const smtpPassword = await ask("SMTP app password: ");

  // 🧾 FRONTEND .env.local
  const frontendEnv =
    `
NEXT_PUBLIC_BUSINESS_NAME=${businessName}
NEXT_PUBLIC_BUSINESS_TAGLINE=${businessTagline}
NEXT_PUBLIC_API_URL=${apiUrl}
`.trim() + "\n";

  // ⚙️ BACKEND .env
  const backendEnv =
    `
DB_HOST=${dbHost}
DB_USER=${dbUser}
DB_PASSWORD=${dbPassword}
DB_NAME=${dbName}

SMTP_EMAIL=${smtpEmail}
SMTP_PASSWORD=${smtpPassword}
BUSINESS_NAME=${businessName}
${sslEnvBlock ? "\n" + sslEnvBlock : ""}
`.trim() + "\n";

  const rootDir = process.cwd();
  const frontendEnvPath = path.join(rootDir, "frontend", ".env.local");
  const backendEnvPath = path.join(rootDir, "backend", ".env");

  fs.writeFileSync(frontendEnvPath, frontendEnv);
  fs.writeFileSync(backendEnvPath, backendEnv);

  console.log(`\n✅ Created ${frontendEnvPath}`);
  console.log(`✅ Created ${backendEnvPath}`);

  // 🏗️ Offer to create database
  await maybeCreateDatabase({ dbHost, dbUser, dbPassword, dbName /*, sslConfig*/ });

  console.log("\n🎉 Setup complete. use npm run dev to start the servers");
  rl.close();
}

main().catch((err) => {
  console.error("❌ Env setup failed:", err);
  rl.close();
});
