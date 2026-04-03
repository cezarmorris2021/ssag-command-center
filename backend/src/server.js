import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Root test
app.get("/", (req, res) => {
  res.send("SSAG Command Center Backend is LIVE");
});

// API test
app.get("/api/health", (req, res) => {
  res.json({ status: "SSAG backend running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
