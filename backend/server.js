const express = require("express");
const cors = require("cors");

const app = express();
const PORT = Number(process.env.PORT || 10000);
const startedAt = new Date().toISOString();

app.set("trust proxy", 1);
// Do not allow arbitrary third-party origins to access the compatibility API.
// CORS_ORIGIN must be explicitly configured for browser access.
const allowedOrigins = (process.env.CORS_ORIGIN || "").split(",").map(s => s.trim()).filter(Boolean);
app.use(cors({ origin(origin, cb) {
  if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
  return cb(new Error("Origin not allowed"));
} }));
app.use(express.json({ limit: "256kb" }));
app.use((_req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Cache-Control": "no-store"
  });
  next();
});

// IMPORTANT: this remains an in-memory compatibility store. It is intentionally
// reported as non-durable so the owner dashboard cannot mistake it for the
// production system-of-record CRM/database.
let deals = [];

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "SSAG Command Center Backend",
    storage: "memory-only",
    persistence: false,
    health: "/api/health"
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "SSAG Command Center Backend",
    startedAt,
    uptimeSeconds: Math.round(process.uptime()),
    storage: "memory-only",
    persistence: false,
    dealCount: deals.length,
    warning: "Data in this compatibility service is not durable. Use the canonical persistent CRM/data service before treating it as a system of record."
  });
});

// Compatibility storage is memory-only and must never accept production deal writes.
// Explicitly disable the unauthenticated mutation endpoint until durable storage,
// identity, RBAC, and audit logging are implemented and verified.
app.post("/deals", (_req, res) => {
  res.status(503).json({ success: false, error: "Deal writes disabled: non-durable compatibility service", persistence: false });
});

/* Retired unsafe endpoint (kept in source temporarily for migration review):
app.post("/deals", (req, res) => {
  const name = String(req.body?.name || "").trim();
  const value = Number(req.body?.value);
  if (!name) return res.status(400).json({ success: false, error: "name is required" });
  if (!Number.isFinite(value) || value < 0) return res.status(400).json({ success: false, error: "value must be a non-negative number" });

  const deal = {
    id: Date.now(),
    name,
    value,
    createdAt: new Date().toISOString()
  };
  deals.push(deal);
  res.status(201).json({ success: true, deal, persistence: false });
});

*/
app.get("/deals", (_req, res) => {
  res.status(503).json({ error: "Deal reads disabled: no authenticated system of record", persistence: false });
});

app.get("/stats", (_req, res) => {
  return res.status(503).json({ error: "Deal statistics unavailable: no authenticated durable system of record", persistence: false });
  /*
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
    biggestDealValue: biggestDeal.value,
    persistence: false
  });
  */
});

app.use((_req, res) => res.status(404).json({ ok: false, error: "Route not found" }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SSAG Command Center Backend listening on ${PORT}`);
});
