# Cowealth Portal — Deployment Guide

## Stack
- React (frontend)
- Supabase (database + authentication)
- Vercel (hosting)

---

## Step 1: Run the Database Setup

1. Go to your Supabase project → **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `SUPABASE_SETUP.sql` and paste it in
4. Click **Run**
5. You should see "Success" — all tables are now created

---

## Step 2: Create Auth Users in Supabase

For each shareholder:
1. Go to **Authentication** → **Users** in Supabase
2. Click **Add User**
3. Enter their email and a temporary password
4. After creating, copy their **User UID**
5. Go to **Table Editor** → `members` table
6. Find that member's row and paste the UID into the `user_id` column

---

## Step 3: Push Code to GitHub

1. Create a new repository on GitHub called `cowealth-portal`
2. Make it **Private**
3. Upload all files from this folder into the repository

Using Git (if installed):
```bash
git init
git add .
git commit -m "Initial Cowealth Portal build"
git remote add origin https://github.com/YOUR_USERNAME/cowealth-portal.git
git push -u origin main
```

---

## Step 4: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with your GitHub account
2. Click **New Project**
3. Import your `cowealth-portal` repository
4. Vercel will auto-detect it as a React app
5. Click **Deploy**
6. Your app will be live at `https://cowealth-portal.vercel.app` (or similar)

---

## Step 5: Test the App

1. Open your live URL
2. Click **Login to Portal**
3. Log in with one of the member emails and passwords you created
4. Confirm the correct dashboard loads based on their role:
   - Admin → Admin Dashboard
   - Treasurer → Finance Dashboard
   - Secretary → Governance Dashboard
   - Member → Member Dashboard

---

## Roles

| Role | Dashboard | Can Do |
|------|-----------|--------|
| Member | Member Dashboard | Submit payments, view own contributions and shares |
| Admin | Admin Dashboard | Approve/reject payments, view all members and shares |
| Treasurer | Finance Dashboard | Verify payments, issue shares, view financial reports |
| Secretary | Governance Dashboard | Record and view meeting minutes |

---

## Share Calculation

- 1 Share = ₦50,000 approved contribution
- Ownership % = Member Shares ÷ Total Issued Shares × 100
- Penalties do NOT convert to shares

---

## Support

Contact the developer for any technical issues before going live.
