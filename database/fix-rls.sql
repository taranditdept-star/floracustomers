-- Fix RLS policies to allow public inserts

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can insert customers" ON customers;
DROP POLICY IF EXISTS "Authenticated users can view customers" ON customers;
DROP POLICY IF EXISTS "Authenticated users can update customers" ON customers;
DROP POLICY IF EXISTS "Authenticated users can delete customers" ON customers;

-- Create new policies
CREATE POLICY "Enable insert for all users" ON customers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON customers
  FOR SELECT USING (true);

CREATE POLICY "Enable update for all users" ON customers
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON customers
  FOR DELETE USING (true);
