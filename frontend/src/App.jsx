import { useState } from "react";

export default function App() {
  const [deals, setDeals] = useState([
    {
      id: 1,
      client: "Desert Ridge Dental",
      value: 4500,
      status: "Closed",
      paymentStatus: "Unpaid",
    },
  ]);

  const updateStatus = (id, newStatus) => {
    setDeals((prev) =>
      prev.map((deal) =>
        deal.id === id ? { ...deal, status: newStatus } : deal
      )
    );
  };

  const updatePayment = (id, newPayment) => {
    setDeals((prev) =>
      prev.map((deal) =>
        deal.id === id ? { ...deal, paymentStatus: newPayment } : deal
      )
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>SSAG Command Center</h2>

      {deals.map((deal) => (
        <div
          key={deal.id}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 10,
            borderRadius: 10,
          }}
        >
          <h3>{deal.client}</h3>

          <p>Value: ${deal.value}</p>

          {/* STATUS DROPDOWN */}
          <div style={{ marginBottom: 10 }}>
            <label>Status: </label>
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
          </div>

          {/* PAYMENT DROPDOWN (THIS IS WHAT YOU WERE MISSING) */}
          <div>
            <label>Payment: </label>
            <select
              value={deal.paymentStatus}
              onChange={(e) => updatePayment(deal.id, e.target.value)}
            >
              <option>Unpaid</option>
              <option>Pending Payment</option>
              <option>Paid</option>
              <option>Overdue</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
