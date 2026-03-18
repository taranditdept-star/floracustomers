# Multi-Company CRM Setup Guide

## Overview
This guide will help you set up the new Ensign Holdings CRM system that supports multiple subsidiaries with role-based access control.

## Step 1: Update Database Schema

1. Go to your Supabase dashboard
2. Click on "SQL Editor"
3. Run the SQL from `database/multi-company-schema.sql`

This will:
- Create companies table with all subsidiaries
- Update customers table to support multi-company
- Update profiles table for role-based access
- Set up proper RLS policies

## Step 2: Create User Accounts

### Marketing Manager (Sees ALL companies)
1. In Supabase, go to Authentication → Users
2. Create user:
   - Email: manager@ensign.co.zw
   - Password: Manager123!
3. Go to SQL Editor and run:
   ```sql
   UPDATE profiles 
   SET role = 'marketing_manager', 
       can_view_all_companies = true,
       company_id = NULL
   WHERE email = 'manager@ensign.co.zw';
   ```

### Company Users (See only their company)
For each subsidiary, create users:

#### Flora Gas
- Email: flora@ensign.co.zw
- Password: Flora123!
```sql
UPDATE profiles 
SET role = 'company_user',
    company_id = (SELECT id FROM companies WHERE name = 'Flora Gas')
WHERE email = 'flora@ensign.co.zw';
```

#### Ecomatt Foods
- Email: ecomatt@ensign.co.zw
- Password: Ecomatt123!
```sql
UPDATE profiles 
SET role = 'company_user',
    company_id = (SELECT id FROM companies WHERE name = 'Ecomatt Foods')
WHERE email = 'ecomatt@ensign.co.zw';
```

#### MountPlus
- Email: mountplus@ensign.co.zw
- Password: Mount123!
```sql
UPDATE profiles 
SET role = 'company_user',
    company_id = (SELECT id FROM companies WHERE name = 'MountPlus')
WHERE email = 'mountplus@ensign.co.zw';
```

*Repeat for all other companies as needed*

## Step 3: Test the System

1. Deploy the updated code to Vercel
2. Test with Marketing Manager account:
   - Login: manager@ensign.co.zw / Manager123!
   - Should see all companies and all customer data
   - Can switch between companies

3. Test with Company User account:
   - Login: flora@ensign.co.zw / Flora123!
   - Should only see Flora Gas data
   - Cannot see other companies' data

## Step 4: Customize Forms

Each company can have different fields:
- **Flora Gas**: Cylinder size, quantity, delivery options
- **Ecomatt Foods**: Product type, order frequency, business type
- **Others**: Add custom fields as needed

## Features

### Marketing Manager
- ✅ View all companies' customer data
- ✅ Switch between companies
- ✅ Edit any customer record
- ✅ See analytics across all subsidiaries
- ✅ Manage users

### Company Users
- ✅ View only their company's data
- ✅ Add new customers
- ✅ Edit their customers
- ✅ Cannot see other companies' data
- ✅ Cannot delete records

## Security

- Row Level Security (RLS) ensures data isolation
- Users can only access their assigned company's data
- Marketing manager has special permissions to view all
- All actions are tracked with created_by field

## Adding New Companies

1. Insert into companies table:
   ```sql
   INSERT INTO companies (name, parent_company, industry)
   VALUES ('New Company', 'Parent Company', 'Industry');
   ```

2. Create user and assign:
   ```sql
   UPDATE profiles 
   SET company_id = (SELECT id FROM companies WHERE name = 'New Company')
   WHERE email = 'user@newcompany.com';
   ```

## Support

For any issues:
1. Check Supabase logs
2. Verify RLS policies are enabled
3. Ensure users have correct company_id
4. Check environment variables on Vercel
