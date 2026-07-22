BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE user_status AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'CLOSED');
CREATE TYPE organization_status AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED');
CREATE TYPE wallet_type AS ENUM (
  'USER_TOIN',
  'USER_MEAL',
  'CORPORATE_FUNDING',
  'MERCHANT_RECEIVABLE',
  'TORBAA_COMMISSION',
  'CAMPAIGN_BUDGET',
  'SETTLEMENT_CLEARING'
);
CREATE TYPE wallet_status AS ENUM ('ACTIVE', 'FROZEN', 'CLOSED');
CREATE TYPE ledger_direction AS ENUM ('DEBIT', 'CREDIT');
CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REVERSED');
CREATE TYPE payment_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'PARTIALLY_REFUNDED', 'REFUNDED');

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone varchar(32) NOT NULL,
  email varchar(320),
  full_name varchar(200) NOT NULL,
  status user_status NOT NULL DEFAULT 'PENDING',
  phone_verified_at timestamptz,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX users_phone_active_unique
  ON users (phone)
  WHERE status <> 'CLOSED';

CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(100) NOT NULL UNIQUE,
  name varchar(160) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(160) NOT NULL UNIQUE,
  name varchar(200) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE role_permissions (
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id uuid NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_role_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  role_id uuid NOT NULL REFERENCES roles(id),
  scope_type varchar(50) NOT NULL,
  scope_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);

CREATE TABLE merchants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_name varchar(240) NOT NULL,
  display_name varchar(160) NOT NULL,
  tax_number varchar(32) NOT NULL,
  tax_office varchar(160),
  status organization_status NOT NULL DEFAULT 'PENDING',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX merchants_tax_number_unique ON merchants (tax_number);

CREATE TABLE merchant_branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id),
  name varchar(160) NOT NULL,
  address text NOT NULL,
  latitude numeric(9,6),
  longitude numeric(9,6),
  phone varchar(32),
  status organization_status NOT NULL DEFAULT 'PENDING',
  meal_card_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE corporate_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_name varchar(240) NOT NULL,
  tax_number varchar(32) NOT NULL UNIQUE,
  tax_office varchar(160),
  status organization_status NOT NULL DEFAULT 'PENDING',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE corporate_employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES corporate_companies(id),
  user_id uuid NOT NULL REFERENCES users(id),
  employee_number varchar(100),
  employment_status varchar(40) NOT NULL DEFAULT 'ACTIVE',
  meal_card_status varchar(40) NOT NULL DEFAULT 'INACTIVE',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (company_id, user_id)
);

CREATE TABLE wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type varchar(50) NOT NULL,
  owner_id uuid NOT NULL,
  wallet_type wallet_type NOT NULL,
  currency char(3) NOT NULL DEFAULT 'TRY',
  status wallet_status NOT NULL DEFAULT 'ACTIVE',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (owner_type, owner_id, wallet_type, currency)
);

CREATE TABLE ledger_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_type varchar(100) NOT NULL,
  external_reference varchar(200),
  idempotency_key varchar(200) NOT NULL UNIQUE,
  status transaction_status NOT NULL DEFAULT 'PENDING',
  reversed_transaction_id uuid REFERENCES ledger_transactions(id),
  metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE ledger_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ledger_transaction_id uuid NOT NULL REFERENCES ledger_transactions(id),
  wallet_id uuid NOT NULL REFERENCES wallets(id),
  direction ledger_direction NOT NULL,
  amount_minor bigint NOT NULL CHECK (amount_minor > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ledger_entries_transaction_idx ON ledger_entries (ledger_transaction_id);
CREATE INDEX ledger_entries_wallet_idx ON ledger_entries (wallet_id, created_at DESC);

CREATE TABLE qr_payment_intents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash varchar(128) NOT NULL UNIQUE,
  branch_id uuid NOT NULL REFERENCES merchant_branches(id),
  cashier_user_id uuid NOT NULL REFERENCES users(id),
  amount_minor bigint NOT NULL CHECK (amount_minor > 0),
  allowed_payment_methods text[] NOT NULL,
  expires_at timestamptz NOT NULL,
  status varchar(40) NOT NULL DEFAULT 'OPEN',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_intent_id uuid NOT NULL UNIQUE REFERENCES qr_payment_intents(id),
  user_id uuid NOT NULL REFERENCES users(id),
  merchant_id uuid NOT NULL REFERENCES merchants(id),
  branch_id uuid NOT NULL REFERENCES merchant_branches(id),
  payment_method varchar(50) NOT NULL,
  gross_amount_minor bigint NOT NULL CHECK (gross_amount_minor > 0),
  commission_amount_minor bigint NOT NULL DEFAULT 0 CHECK (commission_amount_minor >= 0),
  reward_amount_minor bigint NOT NULL DEFAULT 0 CHECK (reward_amount_minor >= 0),
  net_amount_minor bigint NOT NULL CHECK (net_amount_minor >= 0),
  status payment_status NOT NULL DEFAULT 'PENDING',
  ledger_transaction_id uuid REFERENCES ledger_transactions(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (net_amount_minor + commission_amount_minor = gross_amount_minor)
);

CREATE TABLE refunds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL REFERENCES payments(id),
  amount_minor bigint NOT NULL CHECK (amount_minor > 0),
  reason_code varchar(100) NOT NULL,
  status transaction_status NOT NULL DEFAULT 'PENDING',
  ledger_transaction_id uuid REFERENCES ledger_transactions(id),
  approved_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES users(id),
  action varchar(160) NOT NULL,
  resource_type varchar(100) NOT NULL,
  resource_id uuid,
  correlation_id varchar(100),
  ip_address inet,
  user_agent text,
  before_json jsonb,
  after_json jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX audit_logs_resource_idx ON audit_logs (resource_type, resource_id, created_at DESC);
CREATE INDEX audit_logs_actor_idx ON audit_logs (actor_user_id, created_at DESC);

COMMIT;
