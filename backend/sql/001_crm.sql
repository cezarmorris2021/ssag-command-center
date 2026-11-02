CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS crm_deals (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id uuid NOT NULL REFERENCES organizations(id),
 name text NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 200),
 value_cents bigint NOT NULL DEFAULT 0 CHECK (value_cents >= 0),
 stage text NOT NULL DEFAULT 'new' CHECK(stage IN ('new','qualified','proposal','won','lost')),
 created_by uuid NOT NULL REFERENCES users(id),
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS crm_deals_org_idx ON crm_deals(organization_id,created_at DESC);
CREATE TABLE IF NOT EXISTS crm_clients (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id uuid NOT NULL REFERENCES organizations(id),
 name text NOT NULL CHECK(length(trim(name)) BETWEEN 1 AND 200),
 email text,
 phone text,
 created_by uuid NOT NULL REFERENCES users(id),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS crm_clients_org_idx ON crm_clients(organization_id);
CREATE TABLE IF NOT EXISTS crm_invoices (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id uuid NOT NULL REFERENCES organizations(id),
 client_id uuid NOT NULL REFERENCES crm_clients(id),
 amount_cents bigint NOT NULL CHECK(amount_cents >= 0),
 status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','sent','paid','void')),
 external_payment_reference text,
 created_by uuid NOT NULL REFERENCES users(id),
 created_at timestamptz NOT NULL DEFAULT now(),
 CHECK(status <> 'paid' OR external_payment_reference IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS crm_invoices_org_idx ON crm_invoices(organization_id);
CREATE TABLE IF NOT EXISTS crm_audit (
 id bigserial PRIMARY KEY,
 organization_id uuid NOT NULL REFERENCES organizations(id),
 actor_id uuid NOT NULL REFERENCES users(id),
 action text NOT NULL,
 entity_type text NOT NULL,
 entity_id uuid NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS crm_audit_org_idx ON crm_audit(organization_id,created_at DESC);
