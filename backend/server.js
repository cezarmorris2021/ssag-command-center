const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 IN-MEMORY STORE (WORKING VERSION)
let deals = [];

// ADD DEAL
app.post("/deals", (req, res) => {
  const { name, value } = req.body;

  const deal = {
    id: Date.now(),
    name,
    value: Number(value)
  };

  deals.push(deal);

  res.json({ success: true, deal });
});

// GET DEALS
app.get("/deals", (req, res) => {
  res.json(deals);
});

// STATS
app.get("/stats", (req, res) => {
  const totalDeals = deals.length;
  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);
  const averageValue = totalDeals ? totalValue / totalDeals : 0;

  const biggestDeal = deals.reduce(
    (max, d) => (d.value > max.value ? d : max),
    { name: "", value: 0 }
  );

  res.json({
    totalDeals,
    totalValue,
    averageValue,
    biggestDealName: biggestDeal.name,
    biggestDealValue: biggestDeal.value
  });
});

app.listen(3000, () => console.log("Server running"));
