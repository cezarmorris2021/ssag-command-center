import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let deals = [];

// Helpers
function getAnalytics() {
  const totalDeals = deals.length;
  const totalValue = deals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
  const averageValue = totalDeals ? totalValue / totalDeals : 0;
  const biggestDeal = deals.reduce(
    (max, d) => (Number(d.value) > Number(max.value || 0) ? d : max),
    {}
  );

  return {
    totalDeals,
    totalValue,
    averageValue,
    biggestDealName: biggestDeal.name || "None",
    biggestDealValue: Number(biggestDeal.value) || 0,
  };
}

// Dashboard UI
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>SSAG Command Center</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #0a0a0a;
            color: #00ffcc;
            text-align: center;
            padding: 16px;
            margin: 0;
          }
          h1 {
            font-size: 30px;
            margin-bottom: 18px;
          }
          .box {
            border: 1px solid #00ffcc;
            padding: 16px;
            margin: 12px auto;
            max-width: 900px;
          }
          .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 12px;
            margin-top: 12px;
          }
          .stat-card {
            border: 1px solid #00ffcc;
            padding: 14px;
          }
          .stat-label {
            font-size: 13px;
            opacity: 0.85;
            margin-bottom: 8px;
          }
          .stat-value {
            font-size: 24px;
            font-weight: bold;
          }
          input, button, select {
            padding: 10px;
            margin: 5px;
            font-size: 16px;
          }
          input, select {
            width: min(240px, 80vw);
          }
          button {
            background: #00ffcc;
            border: none;
            color: #000;
            font-weight: bold;
            cursor: pointer;
          }
          .deal {
            border-bottom: 1px solid #00ffcc;
            padding: 10px 0;
          }
          .deal:last-child {
            border-bottom: none;
          }
          .deal-name {
            font-weight: bold;
          }
          .deal-stage {
            font-size: 13px;
            opacity: 0.85;
          }
          .row {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            gap: 8px;
          }
          #result {
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <h1>SSAG Command Center</h1>

        <div class="box">
          <p>System Status: ACTIVE</p>
          <button onclick="testAPI()">Test API</button>
          <p id="result"></p>
        </div>

        <div class="box">
          <h3>Add Deal</h3>
          <div class="row">
            <input id="name" placeholder="Deal Name" />
            <input id="value" type="number" placeholder="Value" />
            <select id="stage">
              <option value="Lead">Lead</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal">Proposal</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed Won">Closed Won</option>
            </select>
            <button onclick="addDeal()">Add</button>
          </div>
        </div>

        <div class="box">
          <h3>Analytics</h3>
          <div class="stats">
            <div class="stat-card">
              <div class="stat-label">Total Deals</div>
              <div class="stat-value" id="totalDeals">0</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Total Value</div>
              <div class="stat-value" id="totalValue">$0</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Average Deal</div>
              <div class="stat-value" id="averageValue">$0</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Biggest Deal</div>
              <div class="stat-value" id="biggestDeal">None</div>
            </div>
          </div>
        </div>

        <div class="box">
          <h3>Deals</h3>
          <div id="deals"></div>
        </div>

        <script>
          async function testAPI() {
            const res = await fetch('/api/health');
            const data = await res.json();
            document.getElementById('result').innerText = data.status;
          }

          async function addDeal() {
            const name = document.getElementById('name').value.trim();
            const value = document.getElementById('value').value.trim();
            const stage = document.getElementById('stage').value;

            if (!name || !value) {
              alert('Enter a deal name and value.');
              return;
            }

            await fetch('/api/deals', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, value: Number(value), stage })
            });

            document.getElementById('name').value = '';
            document.getElementById('value').value = '';
            document.getElementById('stage').value = 'Lead';

            await loadDashboard();
          }

          async function loadDashboard() {
            const dealsRes = await fetch('/api/deals');
            const deals = await dealsRes.json();

            const analyticsRes = await fetch('/api/analytics');
            const analytics = await analyticsRes.json();

            document.getElementById('totalDeals').innerText = analytics.totalDeals;
            document.getElementById('totalValue').innerText = '$' + analytics.totalValue.toLocaleString();
            document.getElementById('averageValue').innerText = '$' + Math.round(analytics.averageValue).toLocaleString();
            document.getElementById('biggestDeal').innerText =
              analytics.biggestDealName === 'None'
                ? 'None'
                : analytics.biggestDealName + ' ($' + analytics.biggestDealValue.toLocaleString() + ')';

            const container = document.getElementById('deals');
            container.innerHTML = '';

            if (!deals.length) {
              container.innerHTML = '<div class="deal">No deals yet</div>';
              return;
            }

            deals.forEach(d => {
              container.innerHTML += \`
                <div class="deal">
                  <div class="deal-name">\${d.name} - $\${Number(d.value).toLocaleString()}</div>
                  <div class="deal-stage">Stage: \${d.stage || 'Lead'}</div>
                </div>
              \`;
            });
          }

          loadDashboard();
        </script>
      </body>
    </html>
  `);
});

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "SSAG backend running" });
});

app.get("/api/deals", (req, res) => {
  res.json(deals);
});

app.post("/api/deals", (req, res) => {
  const { name, value, stage } = req.body || {};

  if (!name || value === undefined || value === null || Number.isNaN(Number(value))) {
    return res.status(400).json({ success: false, error: "Invalid deal data" });
  }

  deals.push({
    name: String(name),
    value: Number(value),
    stage: stage || "Lead",
  });

  res.json({ success: true });
});

app.get("/api/analytics", (req, res) => {
  res.json(getAnalytics());
});

app.listen(PORT, () => {
  console.log("SSAG running on port " + PORT);
});
