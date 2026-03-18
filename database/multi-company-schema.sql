-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  parent_company TEXT,
  industry TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create company-specific customer tables
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  surname TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT,
  physical_address TEXT NOT NULL,
  company_specific_fields JSONB, -- Store different fields for each company
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update profiles table for multi-company
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('marketing_manager', 'company_user')),
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL, -- Which company this user belongs to
  can_view_all_companies BOOLEAN DEFAULT FALSE, -- Only for marketing manager
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for companies (only marketing manager can manage)
CREATE POLICY "Marketing managers can view all companies" ON companies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'marketing_manager'
    )
  );

-- Policies for customers
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

-- Policies for profiles
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

-- Insert companies
INSERT INTO companies (name, parent_company, industry) VALUES
('Flora Gas', 'TARAND Investments', 'Gas Supplies'),
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

-- Function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
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
