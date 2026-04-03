const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let deals = [];

// Health
app.get("/", (req, res) => {
  res.send("SSAG BACKEND LIVE 🚀");
});

// Add deal
app.post("/deals", (req, res) => {
  const { name, value } = req.body || {};

  if (!name || value === undefined || value === null || Number.isNaN(Number(value))) {
    return res.status(400).json({
      success: false,
      error: "Missing or invalid deal data"
    });
  }

  const deal = {
    id: Date.now(),
    name: String(name),
    value: Number(value)
  };

  deals.push(deal);

  res.json({
    success: true,
    deal,
    totalDeals: deals.length
  });
});

// Get deals
app.get("/deals", (req, res) => {
  res.json(deals);
});

// Stats
app.get("/stats", (req, res) => {
  const totalDeals = deals.length;
  const totalValue = deals.reduce((sum, d) => sum + Number(d.value || 0), 0);
  const averageValue = totalDeals ? totalValue / totalDeals : 0;

  const biggest = deals.reduce(
    (max, d) => (Number(d.value) > Number(max.value || 0) ? d : max),
    { name: "None", value: 0 }
  );

  res.json({
    totalDeals,
    totalValue,
    averageValue,
    biggestDealName: biggest.name || "None",
    biggestDealValue: biggest.value || 0
  });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
