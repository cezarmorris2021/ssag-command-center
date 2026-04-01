import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity, AlertTriangle, Bell, Briefcase, Building2, CheckCircle2,
  Clock3, DollarSign, Download, FileText, Filter, LayoutDashboard,
  Mail, Plus, Receipt, Search, Settings, Shield, Sparkles, Target,
  TrendingUp, Upload, Users
} from 'lucide-react';
import { api } from './lib/api';

const statusColors = {
  Lead: 'bg-slate-100 text-slate-800',
  Contacted: 'bg-blue-100 text-blue-800',
  'Proposal Sent': 'bg-violet-100 text-violet-800',
  Negotiation: 'bg-amber-100 text-amber-800',
  Closed: 'bg-emerald-100 text-emerald-800',
  Lost: 'bg-rose-100 text-rose-800',
  Onboarding: 'bg-cyan-100 text-cyan-800',
  Active: 'bg-emerald-100 text-emerald-800',
  'At Risk': 'bg-orange-100 text-orange-800',
  Inactive: 'bg-slate-100 text-slate-700',
  Unpaid: 'bg-rose-100 text-rose-800',
  Paid: 'bg-emerald-100 text-emerald-800',
  Overdue: 'bg-orange-100 text-orange-800',
  'Pending Payment': 'bg-amber-100 text-amber-800',
};

const currency = (n) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
}).format(Number(n || 0));

function Pill({ children, tone }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${tone || 'bg-slate-100 text-slate-800'}`}>{children}</span>;
}

function Card({ title, icon: Icon, children, action }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          {Icon ? <Icon className="h-5 w-5 text-slate-600" /> : null}
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function StatCard({ label, value, sublabel, icon: Icon }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
          {sublabel ? <p className="mt-2 text-xs text-slate-500">{sublabel}</p> : null}
        </div>
        {Icon ? <Icon className="h-6 w-6 text-slate-400" /> : null}
      </div>
    </motion.div>
  );
}

function Input({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-600">{label}</span>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400" />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-600">{label}</span>
      <select value={value} onChange={onChange} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400">
        {options.map((o) => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
      </select>
    </label>
  );
}

function LoginScreen({ onLogin, error }) {
  const [email, setEmail] = useState('admin@ssag.local');
  const [password, setPassword] = useState('ChangeMe123!');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await onLogin(email, password);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl lg:grid-cols-2">
        <div className="bg-slate-900 p-8 text-white lg:p-12">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 p-3"><Shield className="h-6 w-6" /></div>
            <div>
              <p className="text-lg font-semibold">SSAG Command Center</p>
              <p className="text-sm text-slate-300">Enterprise operations control layer</p>
            </div>
          </div>
          <div className="mt-12 space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight">Run your company from one dashboard.</h1>
            <p className="max-w-lg text-slate-300">This full-stack build gives you divisions, deals, clients, finance, alerts, and executive visibility inside one web app.</p>
            <div className="grid gap-3 pt-4 sm:grid-cols-2">
              {['Authentication', 'Live dashboard polling', 'API-backed data', 'Professional documentation'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">{item}</div>
              ))}
            </div>
          </div>
        </div>
        <div className="p-8 lg:p-12">
          <div className="mx-auto max-w-md">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Sign in</h2>
            <p className="mt-2 text-sm text-slate-500">Use the seeded admin account first, then replace it with your real setup.</p>
            <form onSubmit={submit} className="mt-8 space-y-4">
              <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              {error ? <p className="text-sm text-rose-600">{error}</p> : null}
              <button disabled={loading} className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60">
                {loading ? 'Signing in...' : 'Enter Command Center'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('ssag-token') || '');
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('all');

  const [newDeal, setNewDeal] = useState({ clientName: '', company: '', service: '', value: '', status: 'Lead', paymentStatus: 'Unpaid', leadSource: 'Outbound', assignedTo: 'Cezar', divisionId: '' });
  const [newClient, setNewClient] = useState({ clientName: '', company: '', service: '', owner: 'Cezar', status: 'Onboarding', startDate: new Date().toISOString().slice(0,10), renewalDate: '', monthlyValue: '', email: '', phone: '', notes: '', divisionId: '' });
  const [newInvoice, setNewInvoice] = useState({ clientName: '', divisionId: '', amount: '', dueDate: new Date().toISOString().slice(0,10), paidDate: '', status: 'Unpaid', method: 'Invoice', notes: '' });

  async function load() {
    const boot = await api.bootstrap();
    setUser(boot.user);
    setData(boot);
    if (!newDeal.divisionId && boot.divisions[0]) {
      setNewDeal((s) => ({ ...s, divisionId: boot.divisions[0].id }));
      setNewClient((s) => ({ ...s, divisionId: boot.divisions[0].id }));
      setNewInvoice((s) => ({ ...s, divisionId: boot.divisions[0].id }));
    }
  }

  useEffect(() => {
    if (!token) return;
    load().catch((e) => setError(e.message));
    const id = setInterval(() => {
      load().catch(() => {});
    }, 10000);
    return () => clearInterval(id);
  }, [token]);

  async function handleLogin(email, password) {
    setError('');
    const result = await api.login(email, password);
    localStorage.setItem('ssag-token', result.token);
    setToken(result.token);
  }

  function logout() {
    localStorage.removeItem('ssag-token');
    setToken('');
    setData(null);
    setUser(null);
  }

  async function createDeal() {
    await api.createDeal(newDeal);
    await load();
    setNewDeal((s) => ({ ...s, clientName: '', company: '', service: '', value: '' }));
  }

  async function createClient() {
    await api.createClient(newClient);
    await load();
    setNewClient((s) => ({ ...s, clientName: '', company: '', service: '', monthlyValue: '', email: '', phone: '', notes: '' }));
  }

  async function createInvoice() {
    await api.createInvoice(newInvoice);
    await load();
    setNewInvoice((s) => ({ ...s, clientName: '', amount: '', notes: '' }));
  }

  async function updateDealStatus(id, status) {
    await api.updateDeal(id, { status });
    await load();
  }

  const filteredDeals = useMemo(() => {
    if (!data) return [];
    return data.deals.filter((d) => {
      const matchesDivision = selectedDivision === 'all' || d.divisionId === selectedDivision;
      const q = search.toLowerCase();
      const matchesSearch = !q || [d.clientName, d.company, d.service, d.status].join(' ').toLowerCase().includes(q);
      return matchesDivision && matchesSearch;
    });
  }, [data, search, selectedDivision]);

  const filteredClients = useMemo(() => {
    if (!data) return [];
    return data.clients.filter((c) => {
      const matchesDivision = selectedDivision === 'all' || c.divisionId === selectedDivision;
      const q = search.toLowerCase();
      const matchesSearch = !q || [c.clientName, c.company, c.service, c.status].join(' ').toLowerCase().includes(q);
      return matchesDivision && matchesSearch;
    });
  }, [data, search, selectedDivision]);

  const filteredInvoices = useMemo(() => {
    if (!data) return [];
    return data.invoices.filter((i) => {
      const matchesDivision = selectedDivision === 'all' || i.divisionId === selectedDivision;
      const q = search.toLowerCase();
      const matchesSearch = !q || [i.clientName, i.status, i.method].join(' ').toLowerCase().includes(q);
      return matchesDivision && matchesSearch;
    });
  }, [data, search, selectedDivision]);

  const divisionLookup = useMemo(() => {
    if (!data) return {};
    return Object.fromEntries(data.divisions.map((d) => [d.id, d]));
  }, [data]);

  if (!token) return <LoginScreen onLogin={handleLogin} error={error} />;
  if (!data) return <div className="p-10 text-sm text-slate-600">Loading command center...</div>;

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'divisions', label: 'Divisions', icon: Building2 },
    { id: 'deals', label: 'Deals', icon: Briefcase },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'finance', label: 'Finance', icon: Receipt },
    { id: 'docs', label: 'Documentation', icon: FileText },
    { id: 'system', label: 'System', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-slate-200 bg-white p-5">
          <div className="mb-6 flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="rounded-2xl bg-slate-900 p-3 text-white"><Shield className="h-5 w-5" /></div>
            <div>
              <p className="text-sm font-semibold">{data.company.name}</p>
              <p className="text-xs text-slate-500">{data.company.standard} Standard • {data.company.version}</p>
            </div>
          </div>
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <button key={item.id} onClick={() => setTab(item.id)} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}>
                  <Icon className="h-4 w-4" /> {item.label}
                </button>
              );
            })}
          </nav>
          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
            <p className="flex items-center gap-2 font-semibold"><Sparkles className="h-4 w-4" /> Added automatically</p>
            <ul className="mt-3 space-y-2">
              <li>Authentication</li>
              <li>API-backed storage</li>
              <li>Live polling</li>
              <li>Activity log</li>
              <li>Executive alerts</li>
              <li>Documentation center</li>
            </ul>
          </div>
        </aside>

        <main className="p-4 md:p-6">
          <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">SSAG Command Center</h1>
              <p className="mt-1 text-sm text-slate-500">Live web-based command center with backend API, authentication, and company-wide visibility.</p>
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-52 bg-transparent text-sm outline-none" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)} className="bg-transparent text-sm outline-none">
                  <option value="all">All divisions</option>
                  {data.divisions.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <button onClick={logout} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm">Log out</button>
            </div>
          </div>

          {tab === 'dashboard' && (
            <div>
              <div className="mb-5">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Executive Overview</h2>
                <p className="mt-1 text-sm text-slate-500">One-screen view of company health, live operating metrics, and action visibility.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total Pipeline" value={currency(data.metrics.totalPipeline)} sublabel="Open and closed deal value" icon={DollarSign} />
                <StatCard label="Weighted Pipeline" value={currency(data.metrics.weightedPipeline)} sublabel="Probability-adjusted forecast" icon={TrendingUp} />
                <StatCard label="Collected Revenue" value={currency(data.metrics.collected)} sublabel="Paid invoices only" icon={CheckCircle2} />
                <StatCard label="Outstanding" value={currency(data.metrics.outstanding)} sublabel="Unpaid and overdue invoices" icon={AlertTriangle} />
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total Deals" value={data.metrics.totalDeals} sublabel="Current pipeline" icon={Briefcase} />
                <StatCard label="Closed Deals" value={data.metrics.closedDeals} sublabel="Won opportunities" icon={Target} />
                <StatCard label="Close Rate" value={`${Math.round(data.metrics.closeRate * 100)}%`} sublabel="Closed deals / total deals" icon={Activity} />
                <StatCard label="Active Clients" value={data.metrics.activeClients} sublabel="Active + onboarding clients" icon={Users} />
              </div>

              <div className="mt-6 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
                <Card title="Deal Stage Pipeline" icon={Briefcase}>
                  <div className="space-y-4">
                    {data.metrics.stageSummary.map((s) => {
                      const max = Math.max(...data.metrics.stageSummary.map((x) => x.value), 1);
                      return (
                        <div key={s.stage}>
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2"><Pill tone={statusColors[s.stage]}>{s.stage}</Pill><span className="text-slate-500">{s.count} deals</span></div>
                            <span className="font-medium">{currency(s.value)}</span>
                          </div>
                          <div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-slate-900" style={{ width: `${(s.value / max) * 100}%` }} /></div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
                <Card title="Executive Alerts" icon={Bell}>
                  <div className="space-y-3">
                    {data.metrics.alerts.map((a) => <div key={a.label} className="flex items-center justify-between rounded-2xl border border-slate-100 p-3"><span className="text-sm text-slate-700">{a.label}</span><Pill>{a.value}</Pill></div>)}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {tab === 'divisions' && (
            <div>
              <div className="mb-5"><h2 className="text-2xl font-semibold tracking-tight text-slate-900">Division Control</h2><p className="mt-1 text-sm text-slate-500">Enterprise visibility into each SSAG division.</p></div>
              <div className="grid gap-4 lg:grid-cols-2">
                {data.metrics.divisionSummary.map((div) => (
                  <Card key={div.id} title={div.name} icon={Building2}>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between"><span className="text-slate-500">Type</span><span>{div.type}</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-500">Lead email</span><span>{div.email}</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-500">Pipeline</span><span>{currency(div.pipeline)}</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-500">Closed revenue</span><span>{currency(div.closed)}</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-500">Clients</span><span>{div.clients}</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-500">Outstanding</span><span>{currency(div.outstanding)}</span></div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {tab === 'deals' && (
            <div>
              <div className="mb-5"><h2 className="text-2xl font-semibold tracking-tight text-slate-900">Deals Pipeline</h2><p className="mt-1 text-sm text-slate-500">Track opportunities, value, status, and next actions.</p></div>
              <div className="grid gap-4 xl:grid-cols-[1.1fr_2fr]">
                <Card title="Add Deal" icon={Plus}>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Select label="Division" value={newDeal.divisionId} onChange={(e) => setNewDeal({ ...newDeal, divisionId: e.target.value })} options={data.divisions.map((d) => ({ value: d.id, label: d.name }))} />
                    <Input label="Client Name" value={newDeal.clientName} onChange={(e) => setNewDeal({ ...newDeal, clientName: e.target.value })} />
                    <Input label="Company" value={newDeal.company} onChange={(e) => setNewDeal({ ...newDeal, company: e.target.value })} />
                    <Input label="Service" value={newDeal.service} onChange={(e) => setNewDeal({ ...newDeal, service: e.target.value })} />
                    <Input label="Value" type="number" value={newDeal.value} onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })} />
                    <Select label="Status" value={newDeal.status} onChange={(e) => setNewDeal({ ...newDeal, status: e.target.value })} options={['Lead','Contacted','Proposal Sent','Negotiation','Closed','Lost']} />
                    <Select label="Payment Status" value={newDeal.paymentStatus} onChange={(e) => setNewDeal({ ...newDeal, paymentStatus: e.target.value })} options={['Unpaid','Pending Payment','Paid']} />
                    <Input label="Lead Source" value={newDeal.leadSource} onChange={(e) => setNewDeal({ ...newDeal, leadSource: e.target.value })} />
                    <Input label="Assigned To" value={newDeal.assignedTo} onChange={(e) => setNewDeal({ ...newDeal, assignedTo: e.target.value })} />
                  </div>
                  <button onClick={createDeal} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"><Plus className="h-4 w-4" /> Create Deal</button>
                </Card>
                <Card title="Live Pipeline" icon={Briefcase}>
                  <div className="space-y-3">
                    {filteredDeals.map((deal) => (
                      <div key={deal.id} className="rounded-2xl border border-slate-100 p-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{deal.clientName}</p>
                            <p className="text-xs text-slate-500">{deal.company} • {deal.service} • {divisionLookup[deal.divisionId]?.name}</p>
                            <p className="mt-2 text-sm text-slate-600">{deal.notes}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Pill tone={statusColors[deal.status]}>{deal.status}</Pill>
                            <Pill tone={statusColors[deal.paymentStatus]}>{deal.paymentStatus}</Pill>
                          </div>
                        </div>
                        <div className="mt-3 grid gap-3 text-sm md:grid-cols-4">
                          <div><span className="text-slate-400">Value</span><p className="font-medium">{currency(deal.value)}</p></div>
                          <div><span className="text-slate-400">Owner</span><p className="font-medium">{deal.assignedTo}</p></div>
                          <div><span className="text-slate-400">Source</span><p className="font-medium">{deal.leadSource}</p></div>
                          <div><span className="text-slate-400">Close Date</span><p className="font-medium">{deal.closeDate || '—'}</p></div>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <select value={deal.status} onChange={(e) => updateDealStatus(deal.id, e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
                            {['Lead','Contacted','Proposal Sent','Negotiation','Closed','Lost'].map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {tab === 'clients' && (
            <div>
              <div className="mb-5"><h2 className="text-2xl font-semibold tracking-tight text-slate-900">Client Accounts</h2><p className="mt-1 text-sm text-slate-500">Manage client relationships, ownership, status, and renewals.</p></div>
              <div className="grid gap-4 xl:grid-cols-[1.1fr_2fr]">
                <Card title="Add Client" icon={Users}>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Select label="Division" value={newClient.divisionId} onChange={(e) => setNewClient({ ...newClient, divisionId: e.target.value })} options={data.divisions.map((d) => ({ value: d.id, label: d.name }))} />
                    <Input label="Client Name" value={newClient.clientName} onChange={(e) => setNewClient({ ...newClient, clientName: e.target.value })} />
                    <Input label="Company" value={newClient.company} onChange={(e) => setNewClient({ ...newClient, company: e.target.value })} />
                    <Input label="Service" value={newClient.service} onChange={(e) => setNewClient({ ...newClient, service: e.target.value })} />
                    <Input label="Owner" value={newClient.owner} onChange={(e) => setNewClient({ ...newClient, owner: e.target.value })} />
                    <Select label="Status" value={newClient.status} onChange={(e) => setNewClient({ ...newClient, status: e.target.value })} options={['Onboarding','Active','At Risk','Inactive']} />
                    <Input label="Start Date" type="date" value={newClient.startDate} onChange={(e) => setNewClient({ ...newClient, startDate: e.target.value })} />
                    <Input label="Renewal Date" type="date" value={newClient.renewalDate} onChange={(e) => setNewClient({ ...newClient, renewalDate: e.target.value })} />
                    <Input label="Monthly Value" type="number" value={newClient.monthlyValue} onChange={(e) => setNewClient({ ...newClient, monthlyValue: e.target.value })} />
                    <Input label="Email" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} />
                    <Input label="Phone" value={newClient.phone} onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} />
                  </div>
                  <button onClick={createClient} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"><Plus className="h-4 w-4" /> Add Client</button>
                </Card>
                <Card title="Client Directory" icon={Users}>
                  <div className="space-y-3">
                    {filteredClients.map((client) => (
                      <div key={client.id} className="rounded-2xl border border-slate-100 p-4">
                        <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-900">{client.clientName}</p><p className="text-xs text-slate-500">{client.company} • {client.service}</p></div><Pill tone={statusColors[client.status]}>{client.status}</Pill></div>
                        <div className="mt-3 grid gap-3 text-sm md:grid-cols-4"><div><span className="text-slate-400">Owner</span><p className="font-medium">{client.owner}</p></div><div><span className="text-slate-400">Start</span><p className="font-medium">{client.startDate || '—'}</p></div><div><span className="text-slate-400">Renewal</span><p className="font-medium">{client.renewalDate || '—'}</p></div><div><span className="text-slate-400">Monthly</span><p className="font-medium">{currency(client.monthlyValue)}</p></div></div>
                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600"><span className="inline-flex items-center gap-1"><Mail className="h-4 w-4" /> {client.email || 'No email'}</span></div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {tab === 'finance' && (
            <div>
              <div className="mb-5"><h2 className="text-2xl font-semibold tracking-tight text-slate-900">Finance Panel</h2><p className="mt-1 text-sm text-slate-500">Track invoices, collections, and cash visibility.</p></div>
              <div className="grid gap-4 xl:grid-cols-[1fr_2fr]">
                <Card title="Create Invoice" icon={Receipt}>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input label="Client Name" value={newInvoice.clientName} onChange={(e) => setNewInvoice({ ...newInvoice, clientName: e.target.value })} />
                    <Select label="Division" value={newInvoice.divisionId} onChange={(e) => setNewInvoice({ ...newInvoice, divisionId: e.target.value })} options={data.divisions.map((d) => ({ value: d.id, label: d.name }))} />
                    <Input label="Amount" type="number" value={newInvoice.amount} onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })} />
                    <Input label="Due Date" type="date" value={newInvoice.dueDate} onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })} />
                    <Select label="Status" value={newInvoice.status} onChange={(e) => setNewInvoice({ ...newInvoice, status: e.target.value })} options={['Unpaid','Paid','Overdue']} />
                    <Input label="Method" value={newInvoice.method} onChange={(e) => setNewInvoice({ ...newInvoice, method: e.target.value })} />
                  </div>
                  <button onClick={createInvoice} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"><Plus className="h-4 w-4" /> Create Invoice</button>
                </Card>
                <Card title="Invoice Ledger" icon={Receipt}>
                  <div className="space-y-3">
                    {filteredInvoices.map((invoice) => (
                      <div key={invoice.id} className="rounded-2xl border border-slate-100 p-4">
                        <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-900">{invoice.clientName}</p><p className="text-xs text-slate-500">{divisionLookup[invoice.divisionId]?.name} • {invoice.method}</p></div><Pill tone={statusColors[invoice.status]}>{invoice.status}</Pill></div>
                        <div className="mt-3 grid gap-3 text-sm md:grid-cols-4"><div><span className="text-slate-400">Amount</span><p className="font-medium">{currency(invoice.amount)}</p></div><div><span className="text-slate-400">Due</span><p className="font-medium">{invoice.dueDate || '—'}</p></div><div><span className="text-slate-400">Paid</span><p className="font-medium">{invoice.paidDate || '—'}</p></div><div><span className="text-slate-400">Method</span><p className="font-medium">{invoice.method}</p></div></div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {tab === 'docs' && (
            <div>
              <div className="mb-5"><h2 className="text-2xl font-semibold tracking-tight text-slate-900">Professional Documentation</h2><p className="mt-1 text-sm text-slate-500">Documentation is included by rule so SSAG systems stay structured and transferable.</p></div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {data.documents.map((doc) => <Card key={doc.id} title={doc.title} icon={FileText}><p className="text-xs font-medium uppercase tracking-wide text-slate-400">{doc.category}</p><p className="mt-3 text-sm leading-7 text-slate-600">{doc.body}</p></Card>)}
                <Card title="What this build includes" icon={Upload}><div className="space-y-3 text-sm text-slate-600"><p>Authentication</p><p>Executive dashboard</p><p>Divisions</p><p>Deals</p><p>Clients</p><p>Invoices</p><p>Alerts</p><p>Activity log</p><p>API backend</p></div></Card>
              </div>
            </div>
          )}

          {tab === 'system' && (
            <div>
              <div className="mb-5"><h2 className="text-2xl font-semibold tracking-tight text-slate-900">System Control</h2><p className="mt-1 text-sm text-slate-500">Core metadata and recommended enterprise structure.</p></div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Card title="System Identity" icon={Shield}><div className="space-y-3 text-sm"><div className="flex items-center justify-between"><span className="text-slate-500">Company</span><span>{data.company.name}</span></div><div className="flex items-center justify-between"><span className="text-slate-500">Owner</span><span>{data.company.owner}</span></div><div className="flex items-center justify-between"><span className="text-slate-500">Version</span><span>{data.company.version}</span></div><div className="flex items-center justify-between"><span className="text-slate-500">Updated</span><span>{data.company.updatedAt}</span></div></div></Card>
                <Card title="Recommended business email structure" icon={Mail}><div className="space-y-3 text-sm text-slate-600"><p>cezar@ssag.com</p><p>sales@ssag.com</p><p>support@ssag.com</p><p>billing@ssag.com</p><p>admin@ssag.com</p></div></Card>
                <Card title="Production upgrades next" icon={Settings}><div className="space-y-3 text-sm text-slate-600"><p>Postgres database</p><p>Role permissions</p><p>HTTPS hosting</p><p>Email integration</p><p>Automated backups</p></div></Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
