import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let deals = [];

// Dashboard UI
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>SSAG Command Center</title>
        <style>
          body {
            font-family: Arial;
            background: #0a0a0a;
            color: #00ffcc;
            text-align: center;
            padding: 20px;
          }
          h1 { font-size: 28px; }
          .box {
            border: 1px solid #00ffcc;
            padding: 15px;
            margin: 10px;
          }
          input, button {
            padding: 8px;
            margin: 5px;
          }
          .deal {
            border-bottom: 1px solid #00ffcc;
            padding: 5px;
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
          <input id="name" placeholder="Deal Name" />
          <input id="value" placeholder="Value" />
          <button onclick="addDeal()">Add</button>
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
            const name = document.getElementById('name').value;
            const value = document.getElementById('value').value;

            await fetch('/api/deals', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, value })
            });

            loadDeals();
          }

          async function loadDeals() {
            const res = await fetch('/api/deals');
            const data = await res.json();

            const container = document.getElementById('deals');
            container.innerHTML = "";

            data.forEach(d => {
              container.innerHTML += "<div class='deal'>" + d.name + " - $" + d.value + "</div>";
            });
          }

          loadDeals();
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
  deals.push(req.body);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log("SSAG running on port " + PORT);
});
