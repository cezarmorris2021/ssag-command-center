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
function normalizeStage(stage) {
  const allowed = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won"];
  return allowed.includes(stage) ? stage : "Lead";
}

async function getDeals() {
  if (useDb) {
    const result = await pool.query(`
      SELECT * FROM deals ORDER BY created_at DESC
    `);
    return result.rows;
  }
  return memoryDeals;
}

async function addDeal({ name, value, stage }) {
  const safeStage = normalizeStage(stage);

  if (useDb) {
    await pool.query(
      `INSERT INTO deals (name, value, stage) VALUES ($1,$2,$3)`,
      [name, value, safeStage]
    );
    return;
  }

  memoryDeals.push({
    id: Date.now(),
    name,
    value,
    stage: safeStage,
    created_at: new Date()
  });
}

async function deleteDeal(id) {
  if (useDb) {
    await pool.query(`DELETE FROM deals WHERE id=$1`, [id]);
    return;
  }
  memoryDeals = memoryDeals.filter(d => String(d.id) !== String(id));
}

async function clearDeals() {
  if (useDb) {
    await pool.query(`DELETE FROM deals`);
    return;
  }
  memoryDeals = [];
}

function getAnalytics(deals) {
  const totalDeals = deals.length;
  const totalValue = deals.reduce((s,d)=>s+Number(d.value||0),0);
  const avg = totalDeals ? totalValue/totalDeals : 0;

  const biggest = deals.reduce((m,d)=>
    Number(d.value)>Number(m.value||0)?d:m,{}
  );

  return {
    totalDeals,
    totalValue,
    averageValue: avg,
    biggestDealName: biggest.name || "None",
    biggestDealValue: biggest.value || 0
  };
}
app.get("/api/health", (req,res)=>{
  res.json({
    status: "SSAG running",
    mode: useDb ? "DATABASE" : "MEMORY"
  });
});

app.get("/api/deals", async (req,res)=>{
  const deals = await getDeals();
  res.json(deals);
});

app.post("/api/deals", async (req,res)=>{
  const { name, value, stage } = req.body;

  if (!name || value === undefined) {
    return res.status(400).json({ error: "Invalid data" });
  }

  await addDeal({ name, value:Number(value), stage });
  res.json({ success:true });
});

app.delete("/api/deals/:id", async (req,res)=>{
  await deleteDeal(req.params.id);
  res.json({ success:true });
});

app.delete("/api/deals", async (req,res)=>{
  await clearDeals();
  res.json({ success:true });
});

app.get("/api/analytics", async (req,res)=>{
  const deals = await getDeals();
  res.json(getAnalytics(deals));
});
initDb().then(()=>{
  app.listen(PORT, ()=>{
    console.log("Running on "+PORT);
  });
});
