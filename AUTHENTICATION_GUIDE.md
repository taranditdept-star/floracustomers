# Setting Up Authentication for Flora Gas System

## Step 1: Run the Auth SQL

1. Go to your Supabase dashboard
2. Click on "SQL Editor"
3. Copy and run the SQL from `database/auth-setup.sql`

## Step 2: Create Users in Supabase Auth

1. In Supabase dashboard, click on "Authentication"
2. Click on "Users"
3. Click "Add user"
4. Create the following users:

### Marketing Manager
- **Email**: manager@floragas.co.zw
- **Password**: Manager123!
- **Role**: Will be set automatically (we'll update it manually)

### Data Capturer
- **Email**: capturer@floragas.co.zw
- **Password**: Capturer123!
- **Role**: Will be set automatically (we'll update it manually)

## Step 3: Set User Roles

After creating users, you need to set their roles:

1. Go to "SQL Editor"
2. Run these commands:

```sql
-- Set marketing manager role
UPDATE profiles 
SET role = 'marketing_manager' 
WHERE email = 'manager@floragas.co.zw';

-- Set data capturer role  
UPDATE profiles 
SET role = 'data_capturer' 
WHERE email = 'capturer@floragas.co.zw';
```

## Step 4: Test the System

1. Deploy the updated code to Vercel
2. Go to your app
3. Click "Staff Login"
4. Try logging in with:
   - **Manager**: manager@floragas.co.zw / Manager123!
   - **Capturer**: capturer@floragas.co.zw / Capturer123!

## What Each Role Can Do:

### Marketing Manager
- View all customer registrations
- Edit any customer data
- See all customer details
- Access the dashboard

### Data Capturer
- Add new customer registrations
- Edit customer data they've entered
- View customer data
- Access the dashboard

## Security Notes:

- Passwords should be changed in production
- You can add more users through the Supabase dashboard
- Each user gets their own login credentials
- The system tracks who created/updated each record

## Customization:

To add more roles:
1. Update the CHECK constraint in profiles table
2. Add the new role to the login page logic
3. Update dashboard permissions as needed
