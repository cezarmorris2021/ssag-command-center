const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

function getToken() {
  return localStorage.getItem('ssag-token');
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  bootstrap: () => request('/bootstrap'),
  metrics: () => request('/metrics'),
  createDeal: (payload) => request('/deals', { method: 'POST', body: JSON.stringify(payload) }),
  updateDeal: (id, payload) => request(`/deals/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  createClient: (payload) => request('/clients', { method: 'POST', body: JSON.stringify(payload) }),
  createInvoice: (payload) => request('/invoices', { method: 'POST', body: JSON.stringify(payload) }),
};
