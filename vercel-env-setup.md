# How to Add Environment Variables on Vercel

## Step 1: Go to Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click on your project `floracustomers`

## Step 2: Add Environment Variables
1. Click on the **"Settings"** tab
2. Click on **"Environment Variables"** in the sidebar
3. Click **"Add"** to add each variable:

### Variable 1:
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://imquxxqvdfrihmwyvlxz.supabase.co`
- **Environments**: Production, Preview, Development (check all)

### Variable 2:
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltcXV4eHF2ZGZyaWhtd3l2bHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MjcyNzYsImV4cCI6MjA4OTQwMzI3Nn0.qddwWdXA6oKu4l6GLqnpKY6DY1GAA6vFI5yNG2aDyDo`
- **Environments**: Production, Preview, Development (check all)

## Step 3: Redeploy
1. After adding the variables, go to the **"Deployments"** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**

## Important:
- Make sure the variable names match EXACTLY (including NEXT_PUBLIC_ prefix)
- Make sure there are no extra spaces in the values
- The variables must be added BEFORE the deployment runs
