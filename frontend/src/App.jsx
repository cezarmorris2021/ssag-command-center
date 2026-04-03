import { useState } from "react";

export default function App() {
  const [status, setStatus] = useState("Lead");
  const [payment, setPayment] = useState("Unpaid");

  return (
    <div style={{ padding: 40 }}>
      <h1>SSAG Command Center (FIXED)</h1>

      <div style={{ marginTop: 20 }}>
        <label>Status</label>
        <br />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Lead</option>
          <option>Contacted</option>
          <option>Closed</option>
        </select>
      </div>

      <div style={{ marginTop: 20 }}>
        <label>Payment</label>
        <br />
        <select value={payment} onChange={(e) => setPayment(e.target.value)}>
          <option>Unpaid</option>
          <option>Paid</option>
        </select>
      </div>

      <div style={{ marginTop: 30 }}>
        <strong>Status:</strong> {status}
      </div>

      <div>
        <strong>Payment:</strong> {payment}
      </div>
    </div>
  );
}
