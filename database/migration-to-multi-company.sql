-- Migration script to update existing database to multi-company

-- First, disable RLS temporarily
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Create companies table if it doesn't exist
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  parent_company TEXT,
  industry TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add company_id to existing customers table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS company_id UUID;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS company_specific_fields JSONB DEFAULT '{}';

-- Add foreign key constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'customers_company_id_fkey'
    ) THEN
        ALTER TABLE customers 
        ADD CONSTRAINT customers_company_id_fkey 
        FOREIGN KEY (company_id) REFERENCES companies(id);
    END IF;
END $$;

-- Update profiles table structure
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company_id UUID;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS can_view_all_companies BOOLEAN DEFAULT FALSE;

-- Update existing customers to have a default company (Flora Gas)
UPDATE customers 
SET company_id = (SELECT id FROM companies WHERE name = 'Flora Gas' LIMIT 1)
WHERE company_id IS NULL;

-- If no Flora Gas company exists, create one first
INSERT INTO companies (name, parent_company, industry) 
SELECT 'Flora Gas', 'TARAND Investments', 'Gas Supplies'
WHERE NOT EXISTS (SELECT 1 FROM companies WHERE name = 'Flora Gas');

-- Update customers again if they were updated before company existed
UPDATE customers 
SET company_id = (SELECT id FROM companies WHERE name = 'Flora Gas' LIMIT 1)
WHERE company_id IS NULL;

-- Move existing customer fields to company_specific_fields for Flora Gas
UPDATE customers 
SET company_specific_fields = jsonb_build_object(
  'gender', gender,
  'family_size', family_size,
  'cylinder_size', cylinder_size,
  'quantity', quantity,
  'usage_frequency', usage_frequency,
  'customer_type', customer_type,
  'payment_method', payment_method,
  'requires_delivery', requires_delivery,
  'additional_notes', additional_notes
)
WHERE company_specific_fields = '{}' AND gender IS NOT NULL;

-- Drop old columns from customers table (they're now in JSONB)
ALTER TABLE customers DROP COLUMN IF EXISTS gender;
ALTER TABLE customers DROP COLUMN IF EXISTS family_size;
ALTER TABLE customers DROP COLUMN IF EXISTS cylinder_size;
ALTER TABLE customers DROP COLUMN IF EXISTS quantity;
ALTER TABLE customers DROP COLUMN IF EXISTS usage_frequency;
ALTER TABLE customers DROP COLUMN IF EXISTS customer_type;
ALTER TABLE customers DROP COLUMN IF EXISTS payment_method;
ALTER TABLE customers DROP COLUMN IF EXISTS requires_delivery;
ALTER TABLE customers DROP COLUMN IF EXISTS additional_notes;

-- Insert all companies (without ON CONFLICT)
INSERT INTO companies (name, parent_company, industry) VALUES
('MountPlus', 'TARAND Investments', 'Branding & Printing'),
('Global Energies Africa', 'TARAND Investments', 'Fuel Supplies'),
('Flora Solar & Tech', 'TARAND Investments', 'Solar Products'),
('New Impetus', 'TARAND Investments', 'Branding & Printing'),
('Continental Treasures Mining', 'REDEEM Resources Africa', 'Mining'),
('Continental Treasures Explosives', 'REDEEM Resources Africa', 'Mining Explosives'),
('Ecomatt Foods', 'REDEEM Resources Africa', 'Food Production'),
('Ecomatt Farm', 'REDEEM Resources Africa', 'Farming'),
('Ecomatt Butcheries', 'REDEEM Resources Africa', 'Meat Sales'),
('Granite Haven Bakery', 'Granite Haven', 'Bakery'),
('Granite Haven Groceries', 'Granite Haven', 'Groceries'),
('Granite Haven Construction', 'Granite Haven', 'Construction'),
('Onset Transport', 'PRUMAC CONNECT', 'Transportation');

-- Update existing profiles to have correct role structure
UPDATE profiles 
SET role = CASE 
  WHEN role = 'marketing_manager' THEN 'marketing_manager'
  ELSE 'company_user'
END,
can_view_all_companies = CASE
  WHEN role = 'marketing_manager' THEN true
  ELSE false
END;

-- Re-enable RLS with new policies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for all users" ON customers;
DROP POLICY IF EXISTS "Enable read access for all users" ON customers;
DROP POLICY IF EXISTS "Enable update for all users" ON customers;
DROP POLICY IF EXISTS "Enable delete for all users" ON customers;

-- Create new policies for companies
DROP POLICY IF EXISTS "Marketing managers can view all companies" ON companies;
CREATE POLICY "Marketing managers can view all companies" ON companies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'marketing_manager'
    )
  );

-- Create new policies for customers
DROP POLICY IF EXISTS "Users can view customers from their company" ON customers;
CREATE POLICY "Users can view customers from their company" ON customers
  FOR SELECT USING (
    company_id = (
      SELECT company_id FROM profiles 
      WHERE profiles.id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.can_view_all_companies = true
    )
  );

CREATE POLICY "Users can insert customers for their company" ON customers
  FOR INSERT WITH CHECK (
    company_id = (
      SELECT company_id FROM profiles 
      WHERE profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can update customers from their company" ON customers
  FOR UPDATE USING (
    company_id = (
      SELECT company_id FROM profiles 
      WHERE profiles.id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.can_view_all_companies = true
    )
  );

-- Create policies for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Marketing managers can view all profiles" ON profiles;
CREATE POLICY "Marketing managers can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'marketing_manager'
    )
  );

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
