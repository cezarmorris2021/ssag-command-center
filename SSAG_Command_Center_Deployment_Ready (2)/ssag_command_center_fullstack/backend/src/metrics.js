const stageProbability = {
  Lead: 0.1,
  Contacted: 0.25,
  'Proposal Sent': 0.5,
  Negotiation: 0.75,
  Closed: 1,
  Lost: 0
};

export function buildMetrics(db) {
  const totalPipeline = db.deals.reduce((sum, d) => sum + Number(d.value || 0), 0);
  const weightedPipeline = db.deals.reduce(
    (sum, d) => sum + Number(d.value || 0) * (stageProbability[d.status] || 0),
    0
  );
  const closedRevenue = db.deals.filter(d => d.status === 'Closed').reduce((sum, d) => sum + Number(d.value || 0), 0);
  const collected = db.invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + Number(i.amount || 0), 0);
  const outstanding = db.invoices.filter(i => i.status !== 'Paid').reduce((sum, i) => sum + Number(i.amount || 0), 0);
  const totalDeals = db.deals.length;
  const closedDeals = db.deals.filter(d => d.status === 'Closed').length;
  const activeClients = db.clients.filter(c => c.status === 'Active' || c.status === 'Onboarding').length;
  const closeRate = totalDeals ? closedDeals / totalDeals : 0;

  const stages = ['Lead', 'Contacted', 'Proposal Sent', 'Negotiation', 'Closed', 'Lost'];
  const stageSummary = stages.map(stage => ({
    stage,
    count: db.deals.filter(d => d.status === stage).length,
    value: db.deals.filter(d => d.status === stage).reduce((sum, d) => sum + Number(d.value || 0), 0)
  }));

  const divisionSummary = db.divisions.map(div => {
    const deals = db.deals.filter(d => d.divisionId === div.id);
    const clients = db.clients.filter(c => c.divisionId === div.id);
    const invoices = db.invoices.filter(i => i.divisionId === div.id);
    return {
      ...div,
      pipeline: deals.reduce((sum, d) => sum + Number(d.value || 0), 0),
      closed: deals.filter(d => d.status === 'Closed').reduce((sum, d) => sum + Number(d.value || 0), 0),
      clients: clients.length,
      outstanding: invoices.filter(i => i.status !== 'Paid').reduce((sum, i) => sum + Number(i.amount || 0), 0)
    };
  });

  const today = new Date();
  const alerts = [
    {
      label: 'Overdue invoices',
      value: db.invoices.filter(i => i.status === 'Overdue').length,
      severity: 'high'
    },
    {
      label: 'Clients onboarding',
      value: db.clients.filter(c => c.status === 'Onboarding').length,
      severity: 'medium'
    },
    {
      label: 'Stalled deals',
      value: db.deals.filter(d => d.status === 'Negotiation' || d.status === 'Proposal Sent').length,
      severity: 'medium'
    },
    {
      label: 'Renewals soon',
      value: db.clients.filter(c => {
        if (!c.renewalDate) return false;
        const diff = Math.ceil((new Date(c.renewalDate) - today) / (1000 * 60 * 60 * 24));
        return diff >= 0 && diff <= 45;
      }).length,
      severity: 'low'
    }
  ];

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
    stageSummary,
    divisionSummary,
    alerts
  };
}
