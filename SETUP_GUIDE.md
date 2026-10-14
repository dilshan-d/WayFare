# 📘 Wayfare – Buyer & Commercial Installation Guide

Thank you for purchasing **Wayfare – Travel, Tour & Hotel Booking System**. This document guides you step-by-step through installing, configuring, running, and deploying the platform for production.

---

## 📋 System Requirements

- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **MongoDB:** v6.0 or higher (Local installation or MongoDB Atlas cluster)

---

## 🛠️ Step 1: Backend Installation & Setup

1. Open your terminal and navigate to the `/Backend` directory:
   ```bash
   cd Backend
   ```

2. Install all required Node.js dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` configuration file inside `/Backend`:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` file:
   ```env
   MONGO_URI=mongodb://localhost:27017/Wayfare
   JWT_SECRET=super_secret_jwt_key_wayfare_2026
   PORT=5000

   # Supabase Storage Configuration (Photo Store)
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_BUCKET=wayfare-images
   ```

5. Seed the database with sample destinations, tours, hotels, rooms, reviews, and admin accounts:
   ```bash
   npm run seed
   ```

6. Start the Backend server:
   ```bash
   npm start
   ```
   *The server will run at `http://localhost:5000`.*

---

## 💻 Step 2: Frontend Installation & Setup

1. Open a new terminal tab and navigate to the `/Frontend` directory:
   ```bash
   cd Frontend
   ```

2. Install Frontend dependencies:
   ```bash
   npm install
   ```

3. Create the `.env` configuration file:
   ```bash
   cp .env.example .env
   ```

4. Configure `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_SUPABASE_BUCKET=wayfare-images
   ```

5. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client web app will open at `http://localhost:5173`.*

---

## 🖼️ Step 3: Supabase Photo Store Setup

1. Sign up / Log in to [Supabase](https://supabase.com/).
2. Create a new Project (e.g. `Wayfare-Storage`).
3. Go to **Storage** -> **Create a new bucket** named `wayfare-images`.
4. Make the bucket **Public** (Public access enabled).
5. Copy your **Project URL** and **anon public API key** from Project Settings -> API into `.env`.
6. *Note: If Supabase credentials are not provided, Wayfare automatically falls back to local uploads seamlessly!*

---

## 💳 Step 4: Integrated Payment Gateway & Checkout

Wayfare features an end-to-end checkout & payment system:
- **Supported Payment Methods:** Credit/Debit Cards (Visa, Mastercard, Amex), Online Banking / UPI, and Pay-at-Property / Cash.
- **Transaction Processing:** Generates unique Transaction References (`TXN-...`), updates booking payment status to `paid`, and issues instant printable confirmation vouchers.
- **Admin Audit:** Admin panel monitors live booking stats, payment logs, and revenue metrics.

---

## 🔑 Default Admin & Demo Credentials

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Administrator** | `admin@wayfare.com` | `Admin@123456` | Executive Admin Dashboard & Full CRUD |
| **Customer** | `user@wayfare.com` | `User@123456` | Tour & Hotel Booking, Customer Portal |

---

## 🚀 Production Deployment Checklist

### Deploying Backend (Render / Railway / AWS / VPS)
1. Push your repository to GitHub.
2. Connect your repository to **Render** or **Railway**.
3. Set Environment Variables (`MONGO_URI`, `JWT_SECRET`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `NODE_ENV=production`).
4. Set Build Command: `npm install`
5. Set Start Command: `node index.js`

### Deploying Frontend (Vercel / Netlify)
1. Import `/Frontend` into **Vercel** or **Netlify**.
2. Set Environment Variables (`VITE_API_URL=https://your-backend-domain.com/api`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
3. Deploy!
