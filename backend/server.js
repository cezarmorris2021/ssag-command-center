const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS deals (
      id SERIAL PRIMARY KEY,
      name TEXT,
      value NUMERIC
    )
  `);
}

app.get("/", (req, res) => {
  res.send("SSAG BACKEND LIVE 🚀");
});

app.post("/deals", async (req, res) => {
  const { name, value } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO deals (name, value) VALUES ($1, $2) RETURNING *",
      [name, value]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/dashboard", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM deals");
    const deals = result.rows;

    const totalDeals = deals.length;
    const totalValue = deals.reduce((sum, d) => sum + Number(d.value), 0);
    const averageValue = totalDeals ? totalValue / totalDeals : 0;

    const biggest = deals.reduce(
      (max, d) => (Number(d.value) > Number(max.value) ? d : max),
      { value: 0, name: "None" }
    );

    res.json({
      totalDeals,
      totalValue,
      averageValue,
      biggestDealName: biggest.name,
      biggestDealValue: biggest.value
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 10000;

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server running on port " + PORT);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
