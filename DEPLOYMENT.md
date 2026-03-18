# Deploying Flora Gas Registration to Vercel

## Step 1: Prepare Your Project

### 1.1 Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit: Flora Gas Registration System"
```

### 1.2 Create .gitignore file (if not exists)
Ensure your .gitignore includes:
```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

## Step 2: Push to GitHub

### 2.1 Create a GitHub Repository
1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Name it: `flora-gas-registration`
4. Keep it public or private (your choice)
5. Don't initialize with README (we already have one)

### 2.2 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/flora-gas-registration.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### 3.1 Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" or "Login"
3. Choose "Continue with GitHub" and authorize Vercel

### 3.2 Import Your Project
1. Click "Add New..." → "Project"
2. Find your `flora-gas-registration` repository
3. Click "Import"

### 3.3 Configure Environment Variables
In the Vercel deployment page:
1. Click "Environment Variables"
2. Add the following:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: `https://imquxxqvdfrihmwyvlxz.supabase.co`
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltcXV4eHF2ZGZyaWhtd3l2bHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MjcyNzYsImV4cCI6MjA4OTQwMzI3Nn0.qddwWdXA6oKu4l6GLqnpKY6DY1GAA6vFI5yNG2aDyDo`

### 3.4 Deploy
1. Click "Deploy"
2. Wait for the deployment to complete (2-3 minutes)
3. Your app will be live at: `https://your-project-name.vercel.app`

## Step 4: Post-Deployment

### 4.1 Ensure Database is Set Up
1. Go to your Supabase dashboard
2. Click on "SQL Editor"
3. Run the SQL from `database/schema.sql` if you haven't already

### 4.2 Test Your Live App
1. Visit your Vercel URL
2. Fill out the registration form
3. Check Supabase dashboard to confirm data is being saved

## Step 5: Custom Domain (Optional)

If you want a custom domain:
1. In Vercel dashboard, click "Settings"
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed by Vercel

## Important Notes

- **Environment Variables**: Never commit your `.env.local` file to Git
- **Database Security**: Your Supabase project is now public, ensure RLS policies are set correctly
- **Updates**: Any push to your main branch will auto-deploy to Vercel

## Troubleshooting

If deployment fails:
1. Check the build logs in Vercel
2. Ensure all environment variables are set
3. Make sure your code builds locally with `npm run build`

For more help, check [Vercel's Next.js deployment guide](https://vercel.com/docs/frameworks/nextjs)
