const express = require("express");
const app = express();

app.use(express.json());

// SIMPLE TEST ROUTE (THIS IS WHAT FIXES YOUR ERROR)
app.get("/", (req, res) => {
  res.send("SSAG BACKEND LIVE 🚀");
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

// PORT (THIS IS IMPORTANT FOR RENDER)
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
