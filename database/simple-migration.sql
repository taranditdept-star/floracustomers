-- Simple migration script - run this step by step

-- Step 1: Create companies table first (no dependencies)
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  parent_company TEXT,
  industry TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Drop the old profiles table and recreate it
DROP TABLE IF EXISTS profiles CASCADE;

-- Step 3: Recreate profiles with new structure (now companies exists)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'company_user' CHECK (role IN ('marketing_manager', 'company_user')),
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  can_view_all_companies BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Add company_id to customers table if not exists
ALTER TABLE customers ADD COLUMN IF NOT EXISTS company_id UUID;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS company_specific_fields JSONB DEFAULT '{}';

-- Step 5: Insert Flora Gas company
INSERT INTO companies (name, parent_company, industry) 
VALUES ('Flora Gas', 'TARAND Investments', 'Gas Supplies');

-- Step 6: Update all existing customers to belong to Flora Gas
UPDATE customers 
SET company_id = (SELECT id FROM companies WHERE name = 'Flora Gas')
WHERE company_id IS NULL;

-- Step 7: Move existing customer data to JSONB
UPDATE customers 
SET company_specific_fields = jsonb_build_object(
  'gender', COALESCE(gender, ''),
  'family_size', COALESCE(family_size, ''),
  'cylinder_size', COALESCE(cylinder_size, ''),
  'quantity', COALESCE(quantity, 0),
  'usage_frequency', COALESCE(usage_frequency, ''),
  'customer_type', COALESCE(customer_type, ''),
  'payment_method', COALESCE(payment_method, ''),
  'requires_delivery', COALESCE(requires_delivery, false),
  'additional_notes', COALESCE(additional_notes, '')
)
WHERE gender IS NOT NULL;

-- Step 8: Drop old columns from customers
ALTER TABLE customers DROP COLUMN IF EXISTS gender;
ALTER TABLE customers DROP COLUMN IF EXISTS family_size;
ALTER TABLE customers DROP COLUMN IF EXISTS cylinder_size;
ALTER TABLE customers DROP COLUMN IF EXISTS quantity;
ALTER TABLE customers DROP COLUMN IF EXISTS usage_frequency;
ALTER TABLE customers DROP COLUMN IF EXISTS customer_type;
ALTER TABLE customers DROP COLUMN IF EXISTS payment_method;
ALTER TABLE customers DROP COLUMN IF EXISTS requires_delivery;
ALTER TABLE customers DROP COLUMN IF EXISTS additional_notes;

-- Step 9: Insert all other companies
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

-- Step 10: Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 11: Create policies
CREATE POLICY "Marketing managers can view all companies" ON companies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'marketing_manager'
    )
  );

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

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Marketing managers can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'marketing_manager'
    )
  );

-- Step 12: Create trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 13: Create triggers
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Step 14: Create trigger for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'company_user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
