import React, { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Building2,
  Users,
  Briefcase,
  Receipt,
  Bell,
  Shield,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Search,
  Plus,
  Settings,
  FileText,
  Activity,
  Filter,
  ChevronRight,
  Mail,
  Phone,
  Target,
  Sparkles,
} from "lucide-react";

const STORAGE_KEY = "ssag-command-center-v2";

const currency = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

const todayISO = () => new Date().toISOString().slice(0, 10);

const stageProbability = {
  Lead: 0.1,
  Contacted: 0.25,
  "Proposal Sent": 0.5,
  Negotiation: 0.75,
  Closed: 1,
  Lost: 0,
};

const pillTones = {
  Lead: "bg-slate-100 text-slate-800",
  Contacted: "bg-blue-100 text-blue-800",
  "Proposal Sent": "bg-violet-100 text-violet-800",
  Negotiation: "bg-amber-100 text-amber-800",
  Closed: "bg-emerald-100 text-emerald-800",
  Lost: "bg-rose-100 text-rose-800",
  Onboarding: "bg-cyan-100 text-cyan-800",
  Active: "bg-emerald-100 text-emerald-800",
  "At Risk": "bg-orange-100 text-orange-800",
  Inactive: "bg-slate-100 text-slate-700",
  Unpaid: "bg-rose-100 text-rose-800",
  Paid: "bg-emerald-100 text-emerald-800",
  Overdue: "bg-orange-100 text-orange-800",
  "Pending Payment": "bg-amber-100 text-amber-800",
};

const seedData = {
  company: {
    name: "SSAG Command Center",
    owner: "Cezar Morris",
    version: "v2.0",
    buildStandard: "SSAG",
    lastUpdated: todayISO(),
  },
  divisions: [
    {
      id: "div-1",
      name: "Sentinel Zero",
      type: "Cyber Risk, Compliance & Advisory",
      leadEmail: "sales@ssag.com",
      status: "Active",
      monthlyTarget: 25000,
    },
    {
      id: "div-2",
      name: "Operations / Enterprise Buildout",
      type: "Internal Systems",
      leadEmail: "admin@ssag.com",
      status: "Active",
      monthlyTarget: 10000,
    },
  ],
  deals: [
    {
      id: "deal-seed-1",
      divisionId: "div-1",
      clientName: "Copper State Medical",
      company: "Copper State Medical",
      service: "Compliance Advisory",
      value: 12000,
      status: "Closed",
      paymentStatus: "Pending Payment",
      leadSource: "Referral",
      assignedTo: "Cezar",
      closeDate: todayISO(),
      nextAction: "Begin onboarding",
      notes: "Closed. Waiting for payment.",
      createdAt: todayISO(),
    },
  ],
  clients: [
    {
      id: "client-seed-1",
      divisionId: "div-1",
      sourceDealId: "deal-seed-1",
      clientName: "Copper State Medical",
      company: "Copper State Medical",
      service: "Compliance Advisory",
      owner: "Cezar",
      status: "Onboarding",
      startDate: todayISO(),
      renewalDate: "",
      monthlyValue: 2000,
      email: "ops@copperstatemedical.com",
      phone: "(555) 201-5501",
      notes: "Needs kickoff packet.",
    },
  ],
  invoices: [
    {
      id: "invoice-seed-1",
      clientName: "Copper State Medical",
      divisionId: "div-1",
      sourceDealId: "deal-seed-1",
      amount: 12000,
      dueDate: todayISO(),
      paidDate: "",
      status: "Unpaid",
      method: "Invoice",
      notes: "Auto-created from closed deal.",
    },
  ],
  activity: [
    {
      id: "activity-seed-1",
      type: "system",
      title: "SSAG Command Center initialized",
      description: "System storage and command center loaded successfully.",
      date: new Date().toLocaleString(),
    },
  ],
  documents: [
    {
      id: "doc-1",
      title: "System Overview",
      category: "Documentation",
      body: "This is the central command system for SSAG. It tracks divisions, deals, clients, invoices, alerts, and executive visibility.",
    },
    {
      id: "doc-2",
      title: "What was added automatically",
      category: "Documentation",
      body: "Added auto-client creation, auto-invoice creation for closed deals, payment controls, executive metrics, alert tracking, documentation, and activity logging because those are core enterprise features you should not have to remember to ask for.",
    },
  ],
};

function safeId(prefix = "id") {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function Pill({ children, tone }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        tone || "bg-slate-100 text-slate-800"
      }`}
    >
      {children}
    </span>
  );
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
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>
          {sublabel ? (
            <p className="mt-2 text-xs text-slate-500">{sublabel}</p>
          ) : null}
        </div>
        {Icon ? <Icon className="h-6 w-6 text-slate-400" /> : null}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-600">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
      />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-600">
        {label}
      </span>
      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400"
      >
        {options.map((o) => (
          <option key={o.value || o} value={o.value || o}>
            {o.label || o}
          </option>
        ))}
      </select>
    </label>
  );
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : seedData;
    } catch {
      return seedData;
    }
  });

  const [tab, setTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("all");

  const [newDeal, setNewDeal] = useState({
    divisionId: "div-1",
    clientName: "",
    company: "",
    service: "",
    value: "",
    status: "Lead",
    paymentStatus: "Unpaid",
    leadSource: "Outbound",
    assignedTo: "Cezar",
    closeDate: "",
    nextAction: "",
    notes: "",
  });

  const [newClient, setNewClient] = useState({
    divisionId: "div-1",
    clientName: "",
    company: "",
    service: "",
    owner: "Cezar",
    status: "Onboarding",
    startDate: todayISO(),
    renewalDate: "",
    monthlyValue: "",
    email: "",
    phone: "",
    notes: "",
  });

  const [newInvoice, setNewInvoice] = useState({
    clientName: "",
    divisionId: "div-1",
    amount: "",
    dueDate: todayISO(),
    paidDate: "",
    status: "Unpaid",
    method: "Invoice",
    notes: "",
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const divisionLookup = useMemo(
    () => Object.fromEntries(data.divisions.map((d) => [d.id, d])),
    [data.divisions]
  );

  function logActivity(type, title, description) {
    setData((prev) => ({
      ...prev,
      company: { ...prev.company, lastUpdated: todayISO() },
      activity: [
        {
          id: safeId("activity"),
          type,
          title,
          description,
          date: new Date().toLocaleString(),
        },
        ...prev.activity,
      ].slice(0, 100),
    }));
  }

  function upsertAutoClientFromDeal(deal) {
    setData((prev) => {
      const exists = prev.clients.some((c) => c.sourceDealId === deal.id);
      if (exists) return prev;

      const client = {
        id: safeId("client"),
        divisionId: deal.divisionId,
        sourceDealId: deal.id,
        clientName: deal.clientName,
        company: deal.company,
        service: deal.service,
        owner: deal.assignedTo || "Cezar",
        status: "Onboarding",
        startDate: deal.closeDate || todayISO(),
        renewalDate: "",
        monthlyValue: Number(deal.value || 0),
        email: "",
        phone: "",
        notes: `Auto-created from closed deal: ${deal.service}`,
      };

      return {
        ...prev,
        clients: [client, ...prev.clients],
      };
    });
  }

  function upsertAutoInvoiceFromDeal(deal) {
    setData((prev) => {
      const exists = prev.invoices.some((i) => i.sourceDealId === deal.id);
      if (exists) return prev;

      const invoice = {
        id: safeId("invoice"),
        clientName: deal.clientName,
        divisionId: deal.divisionId,
        sourceDealId: deal.id,
        amount: Number(deal.value || 0),
        dueDate: todayISO(),
        paidDate: deal.paymentStatus === "Paid" ? todayISO() : "",
        status:
          deal.paymentStatus === "Paid"
            ? "Paid"
            : deal.paymentStatus === "Pending Payment"
            ? "Unpaid"
            : "Unpaid",
        method: "Invoice",
        notes: `Auto-created from closed deal: ${deal.service}`,
      };

      return {
        ...prev,
        invoices: [invoice, ...prev.invoices],
      };
    });
  }

  function syncInvoicePaymentFromDeal(dealId, paymentStatus) {
    setData((prev) => ({
      ...prev,
      invoices: prev.invoices.map((inv) =>
        inv.sourceDealId === dealId
          ? {
              ...inv,
              status:
                paymentStatus === "Paid"
                  ? "Paid"
                  : inv.status === "Overdue"
                  ? "Overdue"
                  : "Unpaid",
              paidDate: paymentStatus === "Paid" ? todayISO() : "",
            }
          : inv
      ),
    }));
  }

  function addDeal() {
    if (!newDeal.clientName || !newDeal.service || !newDeal.value) return;

    const deal = {
      ...newDeal,
      id: safeId("deal"),
      value: Number(newDeal.value),
      createdAt: todayISO(),
      closeDate: newDeal.status === "Closed" ? todayISO() : "",
    };

    setData((prev) => ({
      ...prev,
      company: { ...prev.company, lastUpdated: todayISO() },
      deals: [deal, ...prev.deals],
    }));

    logActivity(
      "deal",
      "New deal created",
      `${deal.clientName} added for ${currency(deal.value)}.`
    );

    if (deal.status === "Closed") {
      upsertAutoClientFromDeal(deal);
      upsertAutoInvoiceFromDeal(deal);
      logActivity(
        "deal",
        "Deal closed",
        `${deal.clientName} was closed and added into client + invoice flow.`
      );
    }

    setNewDeal({
      divisionId: "div-1",
      clientName: "",
      company: "",
      service: "",
      value: "",
      status: "Lead",
      paymentStatus: "Unpaid",
      leadSource: "Outbound",
      assignedTo: "Cezar",
      closeDate: "",
      nextAction: "",
      notes: "",
    });
  }

  function addClient() {
    if (!newClient.clientName || !newClient.service) return;
    const client = {
      ...newClient,
      id: safeId("client"),
      monthlyValue: Number(newClient.monthlyValue || 0),
    };

    setData((prev) => ({
      ...prev,
      clients: [client, ...prev.clients],
    }));

    logActivity(
      "client",
      "Client added",
      `${client.clientName} added to client accounts.`
    );

    setNewClient({
      divisionId: "div-1",
      clientName: "",
      company: "",
      service: "",
      owner: "Cezar",
      status: "Onboarding",
      startDate: todayISO(),
      renewalDate: "",
      monthlyValue: "",
      email: "",
      phone: "",
      notes: "",
    });
  }

  function addInvoice() {
    if (!newInvoice.clientName || !newInvoice.amount) return;
    const invoice = {
      ...newInvoice,
      id: safeId("invoice"),
      amount: Number(newInvoice.amount),
    };

    setData((prev) => ({
      ...prev,
      invoices: [invoice, ...prev.invoices],
    }));

    logActivity(
      "finance",
      "Invoice created",
      `${invoice.clientName} invoice created for ${currency(invoice.amount)}.`
    );

    setNewInvoice({
      clientName: "",
      divisionId: "div-1",
      amount: "",
      dueDate: todayISO(),
      paidDate: "",
      status: "Unpaid",
      method: "Invoice",
      notes: "",
    });
  }

  function updateDealStatus(id, status) {
    let updatedDeal = null;

    setData((prev) => {
      const deals = prev.deals.map((d) => {
        if (d.id !== id) return d;
        updatedDeal = {
          ...d,
          status,
          closeDate: status === "Closed" ? d.closeDate || todayISO() : d.closeDate,
        };
        return updatedDeal;
      });

      return {
        ...prev,
        deals,
      };
    });

    if (!updatedDeal) return;

    logActivity(
      "deal",
      "Deal status updated",
      `${updatedDeal.clientName} moved to ${status}.`
    );

    if (status === "Closed") {
      upsertAutoClientFromDeal(updatedDeal);
      upsertAutoInvoiceFromDeal(updatedDeal);
      logActivity(
        "deal",
        "Deal converted",
        `${updatedDeal.clientName} was auto-converted into client + invoice records.`
      );
    }
  }

  function updateDealPaymentStatus(id, paymentStatus) {
    let updatedDeal = null;

    setData((prev) => {
      const deals = prev.deals.map((d) => {
        if (d.id !== id) return d;
        updatedDeal = { ...d, paymentStatus };
        return updatedDeal;
      });

      return {
        ...prev,
        deals,
      };
    });

    if (!updatedDeal) return;

    syncInvoicePaymentFromDeal(id, paymentStatus);

    logActivity(
      "finance",
      "Payment status updated",
      `${updatedDeal.clientName} marked as ${paymentStatus}.`
    );
  }

  const filteredDeals = useMemo(() => {
    return data.deals.filter((d) => {
      const matchesDivision =
        selectedDivision === "all" || d.divisionId === selectedDivision;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        d.clientName.toLowerCase().includes(q) ||
        d.company.toLowerCase().includes(q) ||
        d.service.toLowerCase().includes(q) ||
        d.status.toLowerCase().includes(q);
      return matchesDivision && matchesSearch;
    });
  }, [data.deals, search, selectedDivision]);

  const filteredClients = useMemo(() => {
    return data.clients.filter((c) => {
      const matchesDivision =
        selectedDivision === "all" || c.divisionId === selectedDivision;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        c.clientName.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.service.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q);
      return matchesDivision && matchesSearch;
    });
  }, [data.clients, search, selectedDivision]);

  const filteredInvoices = useMemo(() => {
    return data.invoices.filter((i) => {
      const matchesDivision =
        selectedDivision === "all" || i.divisionId === selectedDivision;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        i.clientName.toLowerCase().includes(q) ||
        i.status.toLowerCase().includes(q) ||
        i.method.toLowerCase().includes(q);
      return matchesDivision && matchesSearch;
    });
  }, [data.invoices, search, selectedDivision]);

  const metrics = useMemo(() => {
    const totalPipeline = filteredDeals.reduce(
      (sum, d) => sum + Number(d.value || 0),
      0
    );
    const weightedPipeline = filteredDeals.reduce(
      (sum, d) => sum + Number(d.value || 0) * (stageProbability[d.status] || 0),
      0
    );
    const closedRevenue = filteredDeals
      .filter((d) => d.status === "Closed")
      .reduce((sum, d) => sum + Number(d.value || 0), 0);
    const collected = filteredDeals
      .filter((d) => d.paymentStatus === "Paid")
      .reduce((sum, d) => sum + Number(d.value || 0), 0);
    const outstanding = filteredDeals
      .filter((d) => d.status === "Closed" && d.paymentStatus !== "Paid")
      .reduce((sum, d) => sum + Number(d.value || 0), 0);
    const totalDeals = filteredDeals.length;
    const closedDeals = filteredDeals.filter((d) => d.status === "Closed").length;
    const activeClients = filteredClients.filter(
      (c) => c.status === "Active" || c.status === "Onboarding"
    ).length;
    const closeRate = totalDeals ? (closedDeals / totalDeals) * 100 : 0;
    return {
      totalPipeline,
      weightedPipeline,
      closedRevenue,
      collected,
      outstanding,
      totalDeals,
      closedDeals,
      activeClients,
      closeRate,
    };
  }, [filteredDeals, filteredClients]);

  const alerts = useMemo(() => {
    const overdueInvoices = data.invoices.filter((i) => i.status === "Overdue").length;
    const pendingOnboarding = data.clients.filter(
      (c) => c.status === "Onboarding"
    ).length;
    const stalledDeals = data.deals.filter(
      (d) => d.status === "Negotiation" || d.status === "Proposal Sent"
    ).length;
    const unpaidClosedDeals = data.deals.filter(
      (d) => d.status === "Closed" && d.paymentStatus !== "Paid"
    ).length;

    return [
      {
        label: "Overdue invoices",
        value: overdueInvoices,
        tone: overdueInvoices
          ? "bg-rose-100 text-rose-800"
          : "bg-slate-100 text-slate-700",
      },
      {
        label: "Clients onboarding",
        value: pendingOnboarding,
        tone: pendingOnboarding
          ? "bg-amber-100 text-amber-800"
          : "bg-slate-100 text-slate-700",
      },
      {
        label: "Stalled deals",
        value: stalledDeals,
        tone: stalledDeals
          ? "bg-orange-100 text-orange-800"
          : "bg-slate-100 text-slate-700",
      },
      {
        label: "Closed but unpaid",
        value: unpaidClosedDeals,
        tone: unpaidClosedDeals
          ? "bg-blue-100 text-blue-800"
          : "bg-slate-100 text-slate-700",
      },
    ];
  }, [data]);

  const stageSummary = useMemo(() => {
    const stages = [
      "Lead",
      "Contacted",
      "Proposal Sent",
      "Negotiation",
      "Closed",
      "Lost",
    ];
    return stages.map((stage) => ({
      stage,
      count: filteredDeals.filter((d) => d.status === stage).length,
      value: filteredDeals
        .filter((d) => d.status === stage)
        .reduce((sum, d) => sum + Number(d.value || 0), 0),
    }));
  }, [filteredDeals]);

  cons
