import express from "express";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL || "";

app.use(express.json());

const useDb = Boolean(DATABASE_URL);

let memoryDeals = [];

let pool = null;
if (useDb) {
  pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
}

async function initDb() {
  if (!useDb) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS deals (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      value NUMERIC NOT NULL,
      stage TEXT NOT NULL DEFAULT 'Lead',
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
}
