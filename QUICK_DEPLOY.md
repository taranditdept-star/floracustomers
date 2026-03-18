# Quick Vercel Deployment Checklist

## ✅ Pre-flight Check
- [ ] Create `.env.local` file with Supabase credentials
- [ ] Run SQL schema in Supabase dashboard
- [ ] Test locally: `npm run dev`

## 🚀 Deploy Steps

### 1. Push to GitHub
```bash
# If you haven't already:
git remote add origin https://github.com/YOUR_USERNAME/flora-gas-registration.git
git push -u origin master
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Login with GitHub
3. Click "New Project"
4. Select `flora-gas-registration`
5. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://imquxxqvdfrihmwyvlxz.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltcXV4eHF2ZGZyaWhtd3l2bHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MjcyNzYsImV4cCI6MjA4OTQwMzI3Nn0.qddwWdXA6oKu4l6GLqnpKY6DY1GAA6vFI5yNG2aDyDo`
6. Click "Deploy"

### 3. After Deployment
- [ ] Test the live form
- [ ] Check data appears in Supabase
- [ ] Share the URL with your team!

## 🎉 Your app will be live at:
`https://flora-gas-registration-[your-name].vercel.app`

## Need Help?
Check the full guide in `DEPLOYMENT.md`
