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
  function updateDeal(id, field, value) {
    setDeals((prev) =>
      prev.map((deal) =>
        deal.id === id ? { ...deal, [field]: value } : deal
      )
    );
  }
  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>SSAG Command Center</h1>
      {deals.map((deal) => (
        <div
          key={deal.id}
          style={{
            border: "1px solid #ccc",
            padding: 20,
            borderRadius: 10,
            marginTop: 20,
          }}
        >
          <h2>{deal.client}</h2>
          <p>Value: ${deal.value}</p>
          <div>
            <label>Status</label>
            <br />
            <select
              value={deal.status}
              onChange={(e) =>
                updateDeal(deal.id, "status", e.target.value)
              }
            >
              <option>Lead</option>
              <option>Contacted</option>
              <option>Closed</option>
            </select>
          </div>
          <div style={{ marginTop: 10 }}>
            <label>Payment</label>
            <br />
            <select
              value={deal.paymentStatus}
              onChange={(e) =>
                updateDeal(deal.id, "paymentStatus", e.target.value)
              }
            >
              <option>Unpaid</option>
              <option>Paid</option>
            </select>
          </div>
          </div>
      ))}
    </div>
  );
}
