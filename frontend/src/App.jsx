import { useState } from "react";

const initialDeals = [
  {
    id: 1,
    client: "Desert Ridge Dental",
    company: "Desert Ridge Dental",
    service: "Risk Assessment",
    value: 4500,
    status: "Closed",
    paymentStatus: "Unpaid",
    owner: "Cezar",
    source: "Outbound",
    closeDate: "2026-04-02",
  },
];

export default function App() {
  const [deals, setDeals] = useState(initialDeals);

  // ✅ CHANGE DEAL STATUS
  const updateStatus = (id, newStatus) => {
    setDeals((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: newStatus,
              closeDate:
                newStatus === "Closed"
                  ? new Date().toISOString().split("T")[0]
                  : d.closeDate,
            }
          : d
      )
    );
  };

  // ✅ CHANGE PAYMENT STATUS (THIS IS WHAT WAS BROKEN)
  const updatePayment = (id, newPayment) => {
    setDeals((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              paymentStatus: newPayment,
            }
          : d
      )
    );
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>SSAG Command Center</h2>

      {deals.map((deal) => (
        <div
          key={deal.id}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 15,
            borderRadius: 10,
          }}
        >
          <h3>{deal.client}</h3>

          <p>Status: {deal.status}</p>
          <p>Payment: {deal.paymentStatus}</p>
          <p>Value: ${deal.value}</p>

          {/* STATUS DROPDOWN */}
          <select
            value={deal.status}
            onChange={(e) => updateStatus(deal.id, e.target.value)}
          >
            <option>Lead</option>
            <option>Contacted</option>
            <option>Proposal Sent</option>
            <option>Negotiation</option>
            <option>Closed</option>
            <option>Lost</option>
          </select>

          {/* PAYMENT DROPDOWN (FIXED) */}
          <select
            value={deal.paymentStatus}
            onChange={(e) => updatePayment(deal.id, e.target.value)}
            style={{ marginLeft: 10 }}
          >
            <option>Unpaid</option>
            <option>Pending Payment</option>
            <option>Paid</option>
            <option>Overdue</option>
          </select>
        </div>
      ))}
    </div>
  );
}
