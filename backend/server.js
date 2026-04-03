const express = require("express");
const app = express();

app.use(express.json());

// ROOT ROUTE (THIS FIXES YOUR PROBLEM)
app.get("/", (req, res) => {
  res.send("SSAG BACKEND IS LIVE 🚀");
});

// TEST DASHBOARD ROUTE
app.get("/dashboard", (req, res) => {
  res.json({
    totalDeals: 0,
    totalValue: 0,
    averageValue: 0,
    biggestDealName: "None",
    biggestDealValue: 0
  });
});

// SERVER START
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
