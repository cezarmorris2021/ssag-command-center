import { useState, useMemo } from "react";

const initialDeals = [
  {
    id: 1,
    client: "Desert Ridge Dental",
    value: 4500,
    status: "Closed",
    paymentStatus: "Unpaid",
  },
  {
    id: 2,
    client: "Phoenix HVAC LLC",
    value: 2500,
    status: "Lead",
    paymentStatus: "Unpaid",
  },
];

export default function App() {
  const [deals, setDeals] = useState(initialDeals);

  const updateDeal = (id, field, value) => {
    setDeals((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, [field]: value } : d
      )
    );
  };

  const metrics = useMemo(() => {
    const total = deals.reduce((sum, d) => sum + d.value, 0);
    const closed = deals
      .filter((d) => d.status === "Closed")
      .reduce((sum, d) => sum + d.value, 0);
    const paid = deals
      .filter((d) => d.paymentStatus === "Paid")
      .reduce((sum, d) => sum + d.value, 0);

    return { total, closed, paid };
  }, [deals]);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>SSAG Command Center</h1>

      <h2>Metrics</h2>
      <p>Total Pipeline: ${metrics.total}</p>
      <p>Closed Revenue: ${metrics.closed}</p>
      <p>Collected Revenue: ${metrics.paid}</p>

      <h2>Deals</h2>

      {deals.map((deal) => (
        <div
          key={deal.id}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 10,
            borderRadius: 8,
          }}
        >
          <strong>{deal.client}</strong>
          <p>Value: ${deal.value}</p>

          <div>
            Status:
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

          <div>
            Payment:
            <select
              value={deal.paymentStatus}
              onChange={(e) =>
                updateDeal(
                  deal.id,
                  "paymentStatus",
                  e.target.value
                )
              }
            >
              <option>Unpaid</option>
              <option>Paid</option>
            </select>
          </div>
        </div>
      ))}
    <</div>
  );
}
