import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "ssag_command_center_full_v1";

const statusOptions = [
  "Lead",
  "Contacted",
  "Proposal Sent",
  "Negotiation",
  "Closed",
  "Lost",
];

const paymentOptions = [
  "Unpaid",
  "Pending Payment",
  "Paid",
  "Overdue",
];

const sourceOptions = [
  "Outbound",
  "Referral",
  "Website",
  "Inbound Call",
  "Email",
  "Partner",
];

const ownerOptions = ["Cezar", "SSAG Team", "Closer 1", "Closer 2"];

const seedDeals = [
  {
    id: 1,
    client: "Desert Ridge Dental",
    company: "Desert Ridge Dental",
    service: "Risk Assessment",
    value: 4500,
    status: "Closed",
    paymentStatus: "Paid",
    source: "Outbound",
    owner: "Cezar",
    nextStep: "Schedule kickoff",
    closeDate: "2026-04-02",
    notes: "High intent. Asked about timeline and deliverables.",
  },
  {
    id: 2,
    client: "Phoenix HVAC LLC",
    company: "Phoenix HVAC LLC",
    service: "Cybersecurity Risk Assessment",
    value: 2500,
    status: "Lead",
    paymentStatus: "Unpaid",
    source: "Outbound",
    owner: "Cezar",
    nextStep: "Initial follow-up call",
    closeDate: "",
    notes: "Good local fit. Decision maker requested pricing info.",
  },
  {
    id: 3,
    client: "Copper State Medical",
    company: "Copper State Medical",
    service: "Compliance Advisory",
    value: 3800,
    status: "Negotiation",
    paymentStatus: "Pending Payment",
    source: "Referral",
    owner: "Cezar",
    nextStep: "Send revised proposal",
    closeDate: "",
    notes: "Warm referral. Wants bundled compliance package.",
  },
  {
    id: 4,
    client: "Summit Legal Group",
    company: "Summit Legal Group",
    service: "Managed Security Package",
    value: 6200,
    status: "Proposal Sent",
    paymentStatus: "Unpaid",
    source: "Website",
    owner: "SSAG Team",
    nextStep: "Proposal review follow-up",
    closeDate: "",
    notes: "Interested in monthly support retainer.",
  },
];

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function getStatusColor(status) {
  switch (status) {
    case "Lead":
      return { bg: "#e5e7eb", color: "#111827" };
    case "Contacted":
      return { bg: "#dbeafe", color: "#1d4ed8" };
    case "Proposal Sent":
      return { bg: "#ede9fe", color: "#6d28d9" };
    case "Negotiation":
      return { bg: "#fef3c7", color: "#92400e" };
    case "Closed":
      return { bg: "#d1fae5", color: "#065f46" };
    case "Lost":
      return { bg: "#fee2e2", color: "#991b1b" };
    default:
      return { bg: "#e5e7eb", color: "#111827" };
  }
}

function getPaymentColor(status) {
  switch (status) {
    case "Paid":
      return { bg: "#d1fae5", color: "#065f46" };
    case "Pending Payment":
      return { bg: "#fef3c7", color: "#92400e" };
    case "Overdue":
      return { bg: "#fee2e2", color: "#991b1b" };
    case "Unpaid":
    default:
      return { bg: "#fce7f3", color: "#9d174d" };
  }
}

function pillStyle(bg, color) {
  return {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    background: bg,
    color,
  };
}

function cardStyle() {
  return {
    background: "#fff",
    border: "1px solid #dbe1ea",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 6px 20px rgba(15, 23, 42, 0.05)",
  };
}

function inputStyle() {
  return {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    fontSize: 15,
    boxSizing: "border-box",
    background: "#fff",
  };
}

function labelStyle() {
  return {
    display: "block",
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 6,
    color: "#334155",
  };
}

export default function App() {
  const [deals, setDeals] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : seedDeals;
    } catch {
      return seedDeals;
    }
  });

  const [form, setForm] = useState({
    client: "",
    company: "",
    service: "",
    value: "",
    status: "Lead",
    paymentStatus: "Unpaid",
    source: "Outbound",
    owner: "Cezar",
    nextStep: "",
    closeDate: "",
    notes: "",
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
  }, [deals]);

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        deal.client.toLowerCase().includes(searchText) ||
        deal.company.toLowerCase().includes(searchText) ||
        deal.service.toLowerCase().includes(searchText) ||
        deal.owner.toLowerCase().includes(searchText) ||
        deal.source.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || deal.status === statusFilter;

      const matchesPayment =
        paymentFilter === "All" || deal.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [deals, search, statusFilter, paymentFilter]);

  const metrics = useMemo(() => {
    const totalPipeline = deals.reduce((sum, deal) => sum + Number(deal.value || 0), 0);
    const closedRevenue = deals
      .filter((deal) => deal.status === "Closed")
      .reduce((sum, deal) => sum + Number(deal.value || 0), 0);
    const paidRevenue = deals
      .filter((deal) => deal.paymentStatus === "Paid")
      .reduce((sum, deal) => sum + Number(deal.value || 0), 0);
    const outstandingRevenue = deals
      .filter((deal) => deal.paymentStatus !== "Paid")
      .reduce((sum, deal) => sum + Number(deal.value || 0), 0);

    const leadCount = deals.filter((deal) => deal.status === "Lead").length;
    const negotiationCount = deals.filter((deal) => deal.status === "Negotiation").length;
    const closedCount = deals.filter((deal) => deal.status === "Closed").length;
    const overdueCount = deals.filter((deal) => deal.paymentStatus === "Overdue").length;

    return {
      totalPipeline,
      closedRevenue,
      paidRevenue,
      outstandingRevenue,
      leadCount,
      negotiationCount,
      closedCount,
      overdueCount,
    };
  }, [deals]);

  function updateDeal(id, field, value) {
    setDeals((prev) =>
      prev.map((deal) => {
        if (deal.id !== id) return deal;

        const updated = { ...deal, [field]: value };

        if (field === "status" && value === "Closed" && !updated.closeDate) {
          updated.closeDate = todayString();
        }

        if (field === "status" && value !== "Closed") {
          updated.closeDate = "";
        }

        return updated;
      })
    );
  }

  function deleteDeal(id) {
    setDeals((prev) => prev.filter((deal) => deal.id !== id));
  }

  function addDeal() {
    if (!form.client.trim()) {
      alert("Add the client name.");
      return;
    }

    if (!form.service.trim()) {
      alert("Add the service.");
      return;
    }

    if (!form.value || Number(form.value) <= 0) {
      alert("Add a valid deal value.");
      return;
    }

    const newDeal = {
      id: Date.now(),
      client: form.client.trim(),
      company: form.company.trim() || form.client.trim(),
      service: form.service.trim(),
      value: Number(form.value),
      status: form.status,
      paymentStatus: form.paymentStatus,
      source: form.source,
      owner: form.owner,
      nextStep: form.nextStep.trim(),
      closeDate: form.status === "Closed" ? form.closeDate || todayString() : "",
      notes: form.notes.trim(),
    };

    setDeals((prev) => [newDeal, ...prev]);

    setForm({
      client: "",
      company: "",
      service: "",
      value: "",
      status: "Lead",
      paymentStatus: "Unpaid",
      source: "Outbound",
      owner: "Cezar",
      nextStep: "",
      closeDate: "",
      notes: "",
    });
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        color: "#0f172a",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            ...cardStyle(),
            marginBottom: 20,
            background: "linear-gradient(135deg, #0f172a, #14213d)",
            color: "#fff",
          }}
        >
          <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 8 }}>
            SSAG Standard • Command Layer
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.1 }}>
            SSAG Command Center
          </div>
          <div style={{ marginTop: 10, fontSize: 16, opacity: 0.85 }}>
            Live pipeline control, payment tracking, and executive visibility.
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
            marginBottom: 20,
          }}
        >
          <div style={cardStyle()}>
            <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>
              Total Pipeline
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>
              {money(metrics.totalPipeline)}
            </div>
          </div>

          <div style={cardStyle()}>
            <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>
              Closed Revenue
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>
              {money(metrics.closedRevenue)}
            </div>
          </div>

          <div style={cardStyle()}>
            <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>
              Paid Revenue
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>
              {money(metrics.paidRevenue)}
            </div>
          </div>

          <div style={cardStyle()}>
            <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>
              Outstanding
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>
              {money(metrics.outstandingRevenue)}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 14,
            marginBottom: 20,
          }}
        >
          <div style={cardStyle()}>
            <div style={{ fontSize: 13, color: "#64748b" }}>Leads</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{metrics.leadCount}</div>
          </div>
          <div style={cardStyle()}>
            <div style={{ fontSize: 13, color: "#64748b" }}>Negotiation</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>
              {metrics.negotiationCount}
            </div>
          </div>
          <div style={cardStyle()}>
            <div style={{ fontSize: 13, color: "#64748b" }}>Closed Deals</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{metrics.closedCount}</div>
          </div>
          <div style={cardStyle()}>
            <div style={{ fontSize: 13, color: "#64748b" }}>Overdue</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{metrics.overdueCount}</div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(320px, 380px) minmax(0, 1fr)",
            gap: 20,
          }}
        >
          <div style={cardStyle()}>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>
              Add Deal
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle()}>Client Name</label>
              <input
                style={inputStyle()}
                value={form.client}
                onChange={(e) => setForm({ ...form, client: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle()}>Company</label>
              <input
                style={inputStyle()}
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle()}>Service</label>
              <input
                style={inputStyle()}
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle()}>Value</label>
              <input
                type="number"
                style={inputStyle()}
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <div>
                <label style={labelStyle()}>Status</label>
                <select
                  style={inputStyle()}
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {statusOptions.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle()}>Payment</label>
                <select
                  style={inputStyle()}
                  value={form.paymentStatus}
                  onChange={(e) =>
                    setForm({ ...form, paymentStatus: e.target.value })
                  }
                >
                  {paymentOptions.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <div>
                <label style={labelStyle()}>Source</label>
                <select
                  style={inputStyle()}
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                >
                  {sourceOptions.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle()}>Owner</label>
                <select
                  style={inputStyle()}
                  value={form.owner}
                  onChange={(e) => setForm({ ...form, owner: e.target.value })}
                >
                  {ownerOptions.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle()}>Next Step</label>
              <input
                style={inputStyle()}
                value={form.nextStep}
                onChange={(e) => setForm({ ...form, nextStep: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle()}>Close Date</label>
              <input
                type="date"
                style={inputStyle()}
                value={form.closeDate}
                onChange={(e) => setForm({ ...form, closeDate: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle()}>Notes</label>
              <textarea
                style={{ ...inputStyle(), minHeight: 90, resize: "vertical" }}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            <button
              onClick={addDeal}
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "none",
                borderRadius: 14,
                background: "#0f172a",
                color: "#fff",
                fontSize: 15,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Create Deal
            </button>
          </div>

          <div>
            <div style={{ ...cardStyle(), marginBottom: 16 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(180px, 1fr) 180px 180px",
                  gap: 10,
                }}
              >
                <div>
                  <label style={labelStyle()}>Search</label>
                  <input
                    style={inputStyle()}
                    placeholder="Client, company, service..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div>
                  <label style={labelStyle()}>Status Filter</label>
                  <select
                    style={inputStyle()}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option>All</option>
                    {statusOptions.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle()}>Payment Filter</label>
                  <select
                    style={inputStyle()}
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                  >
                    <option>All</option>
                    {paymentOptions.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 14 }}>
              Live Pipeline
            </div>

            {filteredDeals.length === 0 ? (
              <div style={cardStyle()}>
                <div style={{ fontSize: 16, color: "#64748b" }}>
                  No deals match your filters.
                </div>
              </div>
            ) : (
              filteredDeals.map((deal) => {
                const statusColor = getStatusColor(deal.status);
                const paymentColor = getPaymentColor(deal.paymentStatus);

                return (
                  <div key={deal.id} style={{ ...cardStyle(), marginBottom: 16 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        alignItems: "flex-start",
                        marginBottom: 12,
                   
