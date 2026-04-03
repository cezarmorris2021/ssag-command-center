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

function getStats(deals) {
  const totalDeals = deals.length;
  const totalValue = deals.reduce((sum, d) => sum + Number(d.value || 0), 0);
  const averageValue = totalDeals ? totalValue / totalDeals : 0;
  const biggest = deals.reduce(
    (max, d) => (Number(d.value) > Number(max.value || 0) ? d : max),
    { name: "None", value: 0 }
  );

  return {
    totalDeals,
    totalValue,
    averageValue,
    biggestDealName: biggest.name || "None",
    biggestDealValue: biggest.value || 0,app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SSAG Command Center</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: #050505;
      color: #00f5d4;
      padding: 16px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
    }
    h1 {
      text-align: center;
      margin: 10px 0 20px;
      font-size: 42px;
      line-height: 1.1;
    }
    .card {
      border: 1px solid #00f5d4;
      padding: 16px;
      margin-bottom: 16px;
      background: rgba(0,0,0,0.35);
    }
    .card h2 {
      margin-top: 0;
      text-align: center;
      font-size: 28px;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }
    .stat {
      border: 1px solid #00f5d4;
      padding: 16px;
      text-align: center;
    }
    .stat-label {
      font-size: 18px;
      margin-bottom: 10px;
    }
    .stat-value {
      font-size: 34px;
      font-weight: bold;
      word-break: break-word;
    }
    input, button {
      width: 100%;
      padding: 14px;
      font-size: 18px;
      margin-bottom: 12px;
      border: 1px solid #00f5d4;
      border-radius: 0;
    }
    input {
      background: #ffffff;
      color: #000000;
    }
    button {
      background: #00f5d4;
      color: #000000;
      font-weight: bold;
      cursor: pointer;
    }
    .secondary {
      background: transparent;
      color: #00f5d4;
    }
    .deal-item {
      border: 1px solid #00f5d4;
      padding: 12px;
      margin-top: 10px;
    }
    .deal-name {
      font-size: 22px;
      font-weight: bold;
    }
    .deal-meta {
      margin-top: 6px;
      font-size: 16px;
    }
    .status {
      text-align: center;
      font-size: 16px;
      min-height: 24px;
      margin-top: 8px;
    }
    .row-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    @media (min-width: 700px) {
      .grid {
        grid-template-columns: 1fr 1fr;
      }
      .stats-grid {
        grid-template-columns: 1fr 1fr 1fr 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>SSAG Command Center</h1>

    <div class="card">
      <h2>System Status</h2>
      <div class="status" id="systemStatus">Backend Live</div>
    </div>

    <div class="card">
      <h2>Add Deal</h2>
      <input id="dealName" type="text" placeholder="Deal Name" />
      <input id="dealValue" type="number" placeholder="Deal Value" />
      <div class="row-buttons">
        <button onclick="addDeal()">Add Deal</button>
        <button class="secondary" onclick="loadDashboard()">Refresh</button>
      </div>
      <div class="status" id="actionStatus"></div>
    </div>

    <div class="card">
      <h2>Analytics</h2>
      <div class="grid stats-grid">
        <div class="stat">
          <div class="stat-label">Total Deals</div>
          <div class="stat-value" id="totalDeals">0</div>
        </div>
        <div class="stat">
          <div class="stat-label">Total Value</div>
          <div class="stat-value" id="totalValue">$0</div>
        </div>
        <div class="stat">
          <div class="stat-label">Average Deal</div>
          <div class="stat-value" id="averageValue">$0</div>
        </div>
        <div class="stat">
          <div class="stat-label">Biggest Deal</div>
          <div class="stat-value" id="biggestDeal">None</div>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>Deals</h2>
      <div id="dealsList">Loading...</div>
    </div>
  </div>

  <script>async function loadDashboard() {
      try {
        const [statsRes, dealsRes] = await Promise.all([
          fetch('/stats'),
          fetch('/deals')
        ]);

        const stats = await statsRes.json();
        const deals = await dealsRes.json();

        document.getElementById('totalDeals').textContent = stats.totalDeals;
        document.getElementById('totalValue').textContent = '$' + Number(stats.totalValue).toLocaleString();
        document.getElementById('averageValue').textContent = '$' + Number(stats.averageValue).toLocaleString();
        document.getElementById('biggestDeal').textContent =
          stats.biggestDealName === 'None'
            ? 'None'
            : stats.biggestDealName + ' ($' + Number(stats.biggestDealValue).toLocaleString() + ')';

        const dealsList = document.getElementById('dealsList');

        if (!deals.length) {
          dealsList.innerHTML = '<div class="deal-item">No deals yet</div>';
          return;
        }

        dealsList.innerHTML = deals.map(d => \`
          <div class="deal-item">
            <div class="deal-name">\${d.name}</div>
            <div class="deal-meta">Value: $\${Number(d.value).toLocaleString()}</div>
          </div>
        \`).join('');
      } catch (error) {
        document.getElementById('actionStatus').textContent = 'Failed to load dashboard';
      }
    }

    async function addDeal() {
      const name = document.getElementById('dealName').value.trim();
      const value = Number(document.getElementById('dealValue').value);

      if (!name || !value) {
        document.getElementById('actionStatus').textContent = 'Enter a deal name and value';
        return;
      }

      try {
        const res = await fetch('/deals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, value })
        });

        const data = await res.json();

        if (!res.ok) {
          document.getElementById('actionStatus').textContent = data.error || 'Failed to add deal';
          return;
        }

        document.getElementById('dealName').value = '';
        document.getElementById('dealValue').value = '';
        document.getElementById('actionStatus').textContent = 'Deal added successfully';

        loadDashboard();
      } catch (error) {
        document.getElementById('actionStatus').textContent = 'Failed to add deal';
      }
    }

    loadDashboard();
  </script>
</body>
</html>
  `);
});
  };
}app.get("/deals", (req, res) => {
  res.json(loadDeals());
});

app.post("/deals", (req, res) => {
  const deals = loadDeals();
  const { name, value } = req.body || {};

  if (!name || value === undefined || value === null || Number.isNaN(Number(value))) {
    return res.status(400).json({ error: "Missing or invalid deal data" });
  }

  const deal = {
    id: Date.now(),
    name: String(name),
    value: Number(value)
  };

  deals.push(deal);
  saveDeals(deals);

  res.json({
    success: true,
    deal,
    totalDeals: deals.length
  });
});

app.get("/stats", (req, res) => {
  const deals = loadDeals();
  res.json(getStats(deals));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
