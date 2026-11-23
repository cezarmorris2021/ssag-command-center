// Local-only smoke test. Never writes to a production CRM or calls a live payment provider.
const { spawn } = require("node:child_process");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const net = require("node:net");

async function freePort() {
  return new Promise((resolve, reject) => {
    const s = net.createServer();
    s.once("error", reject);
    s.listen(0, "127.0.0.1", () => {
      const port = s.address().port;
      s.close(() => resolve(port));
    });
  });
}

async function waitForHealth(url, child) {
  for (let i = 0; i < 40; i++) {
    if (child.exitCode !== null) throw new Error("Backend exited before becoming ready");
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch (_) { /* waiting for local server */ }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error("Local backend did not become ready");
}

test("health is truthful and unauthenticated deal operations are disabled", async () => {
  const port = await freePort();
  const base = `http://127.0.0.1:${port}`;
  const child = spawn(process.execPath, ["server.js"], {
    cwd: __dirname + "/..",
    env: { ...process.env, PORT: String(port), CORS_ORIGIN: "" },
    stdio: "ignore"
  });
  try {
    await waitForHealth(base + "/api/health", child);
    const health = await (await fetch(base + "/api/health")).json();
    assert.equal(health.ok, true);
    assert.equal(health.persistence, false);
    assert.equal(health.storage, "memory-only");
    for (const [path, options] of [
      ["/deals", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "NOT A REAL LEAD", value: 1 }) }],
      ["/deals", { method: "GET" }],
      ["/stats", { method: "GET" }]
    ]) {
      const response = await fetch(base + path, options);
      assert.equal(response.status, 503, `${options.method} ${path} must remain unavailable until durable authenticated storage exists`);
    }
  } finally {
    child.kill();
  }
});
