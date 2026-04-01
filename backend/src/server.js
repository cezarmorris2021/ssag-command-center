import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { readDb, writeDb, appendActivity } from './dataStore.js';
import { signToken, requireAuth } from './auth.js';
import { buildMetrics } from './metrics.js';

const app = express();
const PORT = process.env.PORT || 4000;

const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: corsOrigin === '*' ? true : corsOrigin.split(',').map(v => v.trim()) }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'ssag-command-center-backend' });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  const db = readDb();
  const user = db.users.find(u => u.email.toLowerCase() === String(email || '').toLowerCase());
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(String(password || ''), user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signToken(user);
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

app.get('/api/bootstrap', requireAuth, (req, res) => {
  const db = readDb();
  const metrics = buildMetrics(db);
  res.json({
    company: db.company,
    user: req.user,
    metrics,
    divisions: db.divisions,
    deals: db.deals,
    clients: db.clients,
    invoices: db.invoices,
    activity: db.activity,
    documents: db.documents
  });
});

app.get('/api/export', requireAuth, (_req, res) => {
  const db = readDb();
  res.json(db);
});

app.get('/api/deals', requireAuth, (_req, res) => {
  res.json(readDb().deals);
});

app.post('/api/deals', requireAuth, (req, res) => {
  const db = readDb();
  const payload = req.body || {};
  const deal = {
    id: `deal-${nanoid(8)}`,
    divisionId: payload.divisionId,
    clientName: payload.clientName,
    company: payload.company || payload.clientName,
    service: payload.service,
    value: Number(payload.value || 0),
    status: payload.status || 'Lead',
    paymentStatus: payload.paymentStatus || 'Unpaid',
    leadSource: payload.leadSource || 'Unknown',
    assignedTo: payload.assignedTo || 'Unassigned',
    closeDate: payload.closeDate || '',
    nextAction: payload.nextAction || '',
    notes: payload.notes || '',
    createdAt: new Date().toISOString().slice(0, 10)
  };
  db.deals.unshift(deal);
  appendActivity(db, 'New deal created', `${deal.clientName} added to pipeline for $${deal.value}.`, 'deal');
  writeDb(db);
  res.status(201).json(deal);
});

app.patch('/api/deals/:id', requireAuth, (req, res) => {
  const db = readDb();
  const deal = db.deals.find(d => d.id === req.params.id);
  if (!deal) return res.status(404).json({ error: 'Deal not found' });
  Object.assign(deal, req.body || {});
  if (deal.status === 'Closed' && !deal.closeDate) {
    deal.closeDate = new Date().toISOString().slice(0, 10);
  }
  appendActivity(db, 'Deal updated', `${deal.clientName} updated to ${deal.status}.`, 'deal');
  writeDb(db);
  res.json(deal);
});

app.get('/api/clients', requireAuth, (_req, res) => {
  res.json(readDb().clients);
});

app.post('/api/clients', requireAuth, (req, res) => {
  const db = readDb();
  const payload = req.body || {};
  const client = {
    id: `client-${nanoid(8)}`,
    divisionId: payload.divisionId,
    clientName: payload.clientName,
    company: payload.company || payload.clientName,
    service: payload.service,
    owner: payload.owner || 'Unassigned',
    status: payload.status || 'Onboarding',
    startDate: payload.startDate || new Date().toISOString().slice(0, 10),
    renewalDate: payload.renewalDate || '',
    monthlyValue: Number(payload.monthlyValue || 0),
    email: payload.email || '',
    phone: payload.phone || '',
    notes: payload.notes || ''
  };
  db.clients.unshift(client);
  appendActivity(db, 'New client added', `${client.clientName} added to client system.`, 'client');
  writeDb(db);
  res.status(201).json(client);
});

app.get('/api/invoices', requireAuth, (_req, res) => {
  res.json(readDb().invoices);
});

app.post('/api/invoices', requireAuth, (req, res) => {
  const db = readDb();
  const payload = req.body || {};
  const invoice = {
    id: `inv-${nanoid(8)}`,
    clientName: payload.clientName,
    divisionId: payload.divisionId,
    amount: Number(payload.amount || 0),
    dueDate: payload.dueDate || new Date().toISOString().slice(0, 10),
    paidDate: payload.paidDate || '',
    status: payload.status || 'Unpaid',
    method: payload.method || 'Invoice',
    notes: payload.notes || ''
  };
  db.invoices.unshift(invoice);
  appendActivity(db, 'Invoice created', `${invoice.clientName} invoice created for $${invoice.amount}.`, 'invoice');
  writeDb(db);
  res.status(201).json(invoice);
});

app.get('/api/documents', requireAuth, (_req, res) => {
  res.json(readDb().documents);
});

app.get('/api/metrics', requireAuth, (_req, res) => {
  res.json(buildMetrics(readDb()));
});

app.listen(PORT, () => {
  console.log(`SSAG backend listening on http://localhost:${PORT}`);
});
