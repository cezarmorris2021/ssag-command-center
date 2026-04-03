const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const DATA_FILE = path.join(__dirname, "deals.json");

// Load deals from file
function loadDeals() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Save deals to file
function saveDeals(deals) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(deals, null, 2));
}

// ROOT
app.get("/", (req, res) => {
  res.send("SSAG BACKEND LIVE 🚀");
});

// ADD DEAL (WORKS IN BROWSER)
app.get("/add", (req, res) => {
  const deals = loadDeals();

  const name = req.query.name || "Test Deal";
  const value = Number(req.query.value || 5000);

  const deal = {
    id: Date.now(),
    name,
    value
  };

  deals.push(deal);
  saveDeals(deals);

  res.json({
    success: true,
    deal,
    totalDeals: deals.length
  });
});

// DASHBOARD
app.get("/dashboard", (req, res) => {
  const deals = loadDeals();

  const totalDeals = deals.length;
  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);
  const averageValue = totalDeals ? totalValue / totalDeals : 0;

  const biggest = deals.reduce(
    (max, d) => (d.value > max.value ? d : max),
    { name: "None", value: 0 }
