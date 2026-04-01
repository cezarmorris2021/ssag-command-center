import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const dataDir = path.resolve(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'db.json');

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function ensureDb() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dbPath)) {
    const passwordHash = bcrypt.hashSync('ChangeMe123!', 10);
    const seed = {
      company: {
        name: 'SSAG Command Center',
        owner: 'Cezar Morris',
        version: 'v1.0',
        standard: 'SSAG',
        createdAt: todayISO(),
        updatedAt: todayISO()
      },
      users: [
        {
          id: 'user-admin-1',
          name: 'SSAG Admin',
          email: 'admin@ssag.local',
          passwordHash,
          role: 'admin'
        }
      ],
      divisions: [
        {
          id: 'div-1',
          name: 'Sentinel Zero',
          type: 'Cyber Risk, Compliance & Advisory',
          email: 'sales@ssag.com',
          status: 'Active',
          monthlyTarget: 25000
        },
        {
          id: 'div-2',
          name: 'Operations / Enterprise Buildout',
          type: 'Internal Systems',
          email: 'admin@ssag.com',
          status: 'Active',
          monthlyTarget: 10000
        }
      ],
      deals: [
        {
          id: 'deal-1',
          divisionId: 'div-1',
          clientName: 'Desert Ridge Dental',
          company: 'Desert Ridge Dental',
          service: 'Risk Assessment',
          value: 4500,
          status: 'Negotiation',
          paymentStatus: 'Unpaid',
          leadSource: 'Outbound',
          assignedTo: 'Cezar',
          closeDate: '',
          nextAction: 'Follow up on proposal',
          notes: 'High intent. Asked about timeline and deliverables.',
          createdAt: todayISO()
        },
        {
          id: 'deal-2',
          divisionId: 'div-1',
          clientName: 'Copper State Medical',
          company: 'Copper State Medical',
          service: 'Compliance Advisory',
          value: 12000,
          status: 'Closed',
          paymentStatus: 'Pending Payment',
          leadSource: 'Referral',
          assignedTo: 'Cezar',
          closeDate: todayISO(),
          nextAction: 'Start onboarding',
          notes: 'Closed verbally. Waiting on payment.',
          createdAt: todayISO()
        }
      ],
      clients: [
        {
          id: 'client-1',
          divisionId: 'div-1',
          clientName: 'Copper State Medical',
          company: 'Copper State Medical',
          service: 'Compliance Advisory',
          owner: 'Cezar',
          status: 'Onboarding',
          startDate: todayISO(),
          renewalDate: '2027-03-31',
          monthlyValue: 2000,
          email: 'ops@copperstatemedical.com',
          phone: '(555) 201-5501',
          notes: 'Needs kickoff packet and onboarding checklist.'
        }
      ],
      invoices: [
        {
          id: 'inv-1',
          clientName: 'Copper State Medical',
          divisionId: 'div-1',
          amount: 4000,
          dueDate: todayISO(),
          paidDate: '',
          status: 'Unpaid',
          method: 'Invoice',
          notes: 'Deposit invoice'
        }
      ],
      activity: [
        {
          id: 'act-1',
          type: 'system',
          title: 'SSAG Command Center initialized',
          description: 'Foundation full-stack system created and ready for live data.',
          date: new Date().toLocaleString()
        }
      ],
      documents: [
        {
          id: 'doc-1',
          title: 'System Overview',
          category: 'Documentation',
          body: 'This Command Center is the control layer for SSAG. It manages deals, clients, divisions, invoices, alerts, and executive visibility in one place.'
        },
        {
          id: 'doc-2',
          title: 'What was added automatically',
          category: 'Documentation',
          body: 'Added authentication, alerts, activity log, export capability, division rollups, and weighted pipeline logic because those are foundational enterprise features people often need without knowing the exact terms.'
        }
      ]
    };
    fs.writeFileSync(dbPath, JSON.stringify(seed, null, 2));
  }
}

export function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

export function writeDb(data) {
  data.company.updatedAt = todayISO();
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export function appendActivity(data, title, description, type = 'system') {
  data.activity.unshift({
    id: `act-${Date.now()}`,
    type,
    title,
    description,
    date: new Date().toLocaleString()
  });
  data.activity = data.activity.slice(0, 100);
}
