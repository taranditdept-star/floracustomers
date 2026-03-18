-- Create customers table
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  surname TEXT NOT NULL,
  phone_number TEXT NOT NULL UNIQUE,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  physical_address TEXT NOT NULL,
  family_size TEXT,
  cylinder_size TEXT NOT NULL CHECK (cylinder_size IN ('3kg', '5kg', '9kg', '13kg', '19kg', '48kg')),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  usage_frequency TEXT CHECK (usage_frequency IN ('daily', 'weekly', 'bi-weekly', 'monthly', 'occasionally')),
  customer_type TEXT NOT NULL CHECK (customer_type IN ('residential', 'commercial', 'wholesale', 'reseller', 'agent')),
  payment_method TEXT CHECK (payment_method IN ('cash', 'ecocash', 'bank_transfer', 'credit')),
  requires_delivery BOOLEAN DEFAULT false,
  additional_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster searches
CREATE INDEX idx_customers_phone ON customers(phone_number);
CREATE INDEX idx_customers_created_at ON customers(created_at);

-- Set up RLS (Row Level Security)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create policy for inserts (anyone can insert)
CREATE POLICY "Anyone can insert customers" ON customers
  FOR INSERT WITH CHECK (true);

-- Create policy for selects (only authenticated users can read)
CREATE POLICY "Authenticated users can view customers" ON customers
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy for updates (only authenticated users can update)
CREATE POLICY "Authenticated users can update customers" ON customers
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy for deletes (only authenticated users can delete)
CREATE POLICY "Authenticated users can delete customers" ON customers
  FOR DELETE USING (auth.role() = 'authenticated');

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
