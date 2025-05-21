/*
  # Fix advisor role and policies

  1. Changes
    - Add role column to advisors table
    - Update policies to use the new role column
    - Keep all other tables and policies unchanged

  2. Security
    - Maintain RLS on all tables
    - Update policies to work with the new role column
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Investments table
CREATE TABLE IF NOT EXISTS investments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  type text NOT NULL CHECK (type IN ('CDB', 'LCI', 'LCA', 'DEBENTURE')),
  logo_url text,
  image_url text,
  min_amount numeric NOT NULL,
  total_amount numeric NOT NULL,
  available_amount numeric NOT NULL,
  reserved_amount numeric NOT NULL DEFAULT 0,
  yield_rate numeric NOT NULL,
  yield_index text NOT NULL CHECK (yield_index IN ('CDI', 'IPCA')),
  term integer NOT NULL,
  guarantee text NOT NULL,
  payment_frequency text CHECK (payment_frequency IN ('MONTHLY', 'QUARTERLY', 'SEMIANNUAL')),
  risk_level text CHECK (risk_level IN ('LOW', 'MODERATE', 'HIGH')),
  status text NOT NULL CHECK (status IN ('DRAFT', 'OPEN', 'PAUSED', 'CLOSED')) DEFAULT 'DRAFT',
  is_visible boolean NOT NULL DEFAULT false,
  is_highlighted boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Advisors table with role column
CREATE TABLE IF NOT EXISTS advisors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id uuid REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  role text NOT NULL CHECK (role IN ('ADMIN', 'ADVISOR')) DEFAULT 'ADVISOR',
  total_investments numeric NOT NULL DEFAULT 0,
  active_investors integer NOT NULL DEFAULT 0,
  accumulated_commissions numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Investors table
CREATE TABLE IF NOT EXISTS investors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  cpf text NOT NULL UNIQUE,
  rg text,
  address jsonb,
  bank_account jsonb,
  advisor_id uuid REFERENCES advisors(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  investment_id uuid REFERENCES investments(id) ON DELETE CASCADE,
  investor_id uuid REFERENCES investors(id),
  advisor_id uuid REFERENCES advisors(id),
  amount numeric NOT NULL,
  status text NOT NULL CHECK (status IN ('PENDING_SIGNATURE', 'SIGNED', 'CONFIRMED', 'CANCELLED')) DEFAULT 'PENDING_SIGNATURE',
  created_at timestamptz NOT NULL DEFAULT now(),
  signed_at timestamptz,
  confirmed_at timestamptz
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  investment_id uuid REFERENCES investments(id) ON DELETE CASCADE,
  name text NOT NULL,
  url text NOT NULL,
  type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Commissions table
CREATE TABLE IF NOT EXISTS commissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  advisor_id uuid REFERENCES advisors(id),
  reservation_id uuid REFERENCES reservations(id),
  amount numeric NOT NULL,
  type text NOT NULL CHECK (type IN ('UPFRONT', 'RECURRING')),
  status text NOT NULL CHECK (status IN ('PENDING', 'PAID')) DEFAULT 'PENDING',
  due_date timestamptz NOT NULL,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE advisors ENABLE ROW LEVEL SECURITY;
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;

-- Policies for investments
CREATE POLICY "Investments are viewable by authenticated users"
  ON investments FOR SELECT
  TO authenticated
  USING (is_visible = true OR auth.uid() IN (
    SELECT auth_id FROM advisors WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Admins can manage investments"
  ON investments FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT auth_id FROM advisors 
      WHERE auth_id = auth.uid() 
      AND role = 'ADMIN'
    )
  );

-- Policies for advisors
CREATE POLICY "Advisors can view their own profile"
  ON advisors FOR SELECT
  TO authenticated
  USING (auth_id = auth.uid());

CREATE POLICY "Admins can manage advisors"
  ON advisors FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT auth_id FROM advisors 
      WHERE auth_id = auth.uid() 
      AND role = 'ADMIN'
    )
  );

-- Policies for investors
CREATE POLICY "Advisors can manage their investors"
  ON investors FOR ALL
  TO authenticated
  USING (
    advisor_id IN (
      SELECT id FROM advisors 
      WHERE auth_id = auth.uid()
    )
  );

-- Policies for reservations
CREATE POLICY "Advisors can manage their reservations"
  ON reservations FOR ALL
  TO authenticated
  USING (
    advisor_id IN (
      SELECT id FROM advisors 
      WHERE auth_id = auth.uid()
    )
  );

-- Policies for documents
CREATE POLICY "Documents are viewable by authenticated users"
  ON documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage documents"
  ON documents FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT auth_id FROM advisors 
      WHERE auth_id = auth.uid() 
      AND role = 'ADMIN'
    )
  );

-- Policies for commissions
CREATE POLICY "Advisors can view their commissions"
  ON commissions FOR SELECT
  TO authenticated
  USING (
    advisor_id IN (
      SELECT id FROM advisors 
      WHERE auth_id = auth.uid()
    )
  );

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER investments_updated_at
  BEFORE UPDATE ON investments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER advisors_updated_at
  BEFORE UPDATE ON advisors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER investors_updated_at
  BEFORE UPDATE ON investors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();