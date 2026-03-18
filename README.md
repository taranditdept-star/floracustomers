# Flora Gas Customer Registration System

A digital customer registration system for Flora Gas Zimbabwe built with Next.js and Chakra UI, integrated with Supabase for data storage.

## Features

- 📝 Digital customer registration form
- 🎨 Beautiful UI matching the design specifications
- 💾 Real-time data storage with Supabase
- ✅ Form validation and error handling
- 📱 Responsive design for all devices

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up/login with your GitHub account
4. Click "New Project"
5. Select your organization
6. Enter project details:
   - **Project Name**: `flora-gas-registration`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose the closest region to Zimbabwe (e.g., South Africa)
7. Click "Create new project"
8. Wait for the project to be created (2-3 minutes)

### 2. Set up the Database

1. In your Supabase project dashboard, click on "SQL Editor" in the sidebar
2. Click "New query"
3. Copy the SQL from `database/schema.sql` in this project
4. Paste it into the SQL editor
5. Click "Run" to execute the SQL and create the customers table

### 3. Get Your Supabase Credentials

1. In Supabase dashboard, click on "Settings" (gear icon)
2. Click on "API"
3. You'll find two important values:
   - **Project URL** (looks like: https://xxxxxxxxxxxxx.supabase.co)
   - **anon public** API key (starts with: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)

### 4. Configure Environment Variables

1. Create a file named `.env.local` in the root of your project
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the placeholder values with your actual Supabase URL and anon key.

### 5. Run the Application

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Viewing Customer Data

To view registered customers:

1. Go to your Supabase dashboard
2. Click on "Table Editor" in the sidebar
3. Click on the "customers" table
4. You'll see all registered customer data

## Deploying to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

## Database Schema

The `customers` table includes:

- Personal Information: Name, Surname, Phone, Gender, Address
- Household Details: Family size, Cylinder size, Quantity, Usage frequency
- Customer Type: Residential, Commercial, Wholesale, Reseller, Agent
- Preferences: Payment method, Delivery requirements, Additional notes

## Security

- Row Level Security (RLS) is enabled
- Anyone can insert customer data
- Only authenticated users can view/update/delete data
- Phone numbers are unique to prevent duplicates

## Support

For any issues or questions, please check the Supabase documentation at [supabase.com/docs](https://supabase.com/docs)
