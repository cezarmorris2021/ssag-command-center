const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const DATA_FILE = path.join("/tmp", "deals.json");

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

function loadDeals() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

function saveDeals(deals) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(deals, null, 2));
}

app.get("/", (req, res) => {
  res.send(`
    <html>
      <body style="font-family:Arial;background:#050505;color:#00f5d4;padding:20px">
        <h1>SSAG BACKEND LIVE 🚀</h1>
        <p><a style="color:#00f5d4" href="/add?name=Test%20Deal&value=5000">Add Test Deal</a></p>
        <p><a style="color:#00f5d4" href="/stats">Open Stats</a></p>
      </body>
    </html>
  `);
});

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

app.get("/deals", (req, res) => {
  res.json(loadDeals());
});

app.get("/stats", (req, res) => {
  const deals = loadDeals();
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
