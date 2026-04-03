import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Simple UI page
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
            padding: 50px;
          }
          h1 { font-size: 32px; }
          .box {
            border: 1px solid #00ffcc;
            padding: 20px;
            margin-top: 20px;
          }
          button {
            padding: 10px 20px;
            background: #00ffcc;
            border: none;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <h1>SSAG Command Center</h1>
        <div class="box">
          <p>System Status: ACTIVE</p>
          <p>Backend Connected</p>
          <button onclick="testAPI()">Test API</button>
          <p id="result"></p>
        </div>

        <script>
          async function testAPI() {
            const res = await fetch('/api/health');
            const data = await res.json();
            document.getElementById('result').innerText = data.status;
          }
        </script>
      </body>
    </html>
  `);
});

// API route
app.get("/api/health", (req, res) => {
  res.json({ status: "SSAG backend running" });
});

app.listen(PORT, () => {
  console.log("SSAG running on port " + PORT);
});
