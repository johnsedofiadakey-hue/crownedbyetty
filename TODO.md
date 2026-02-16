# 🚀 Final Deployment Steps

This list contains the final steps to connect your live website to your database.

### 1. MongoDB Atlas Setup (Cloud Database)
- [ ] Create a free account at [mongodb.com](https://www.mongodb.com/cloud/atlas/register).
- [ ] Create a **Shared (M0 Free)** Cluster.
- [ ] **Security**: 
    - [ ] Create a database user (Username/Password).
    - [ ] Add IP `0.0.0.0/0` to the Access List (allows Render to connect).
- [ ] **Connection**:
    - [ ] Click "Connect" -> "Drivers".
    - [ ] Copy the Connection String (`mongodb+srv://...`).
    - [ ] Replace `<password>` in the string with your actual password.

### 2. Connect Backend (Render)
- [ ] Go to your [Render Dashboard](https://dashboard.render.com).
- [ ] Select your backend service.
- [ ] Go to **Environment** settings.
- [ ] Add Variable:
    - **Key**: `MONGO_URI`
    - **Value**: (Your MongoDB connection string from step 1).
- [ ] Save changes (Render will restart automatically).

### 3. Connect Frontend (Vercel)
- [ ] Go to your [Vercel Dashboard](https://vercel.com/john-dakeys-projects/crownedbyetty-frontend).
- [ ] Go to **Settings** > **Environment Variables**.
- [ ] Add Variable:
    - **Key**: `NEXT_PUBLIC_API_URL`
    - **Value**: (Your Render backend URL, e.g., `https://crowned-backend.onrender.com`).
- [ ] **Redeploy**: Go to the "Deployments" tab, find the latest build, click the three dots (...), and select **Redeploy** to apply the new variable.

### 4. Final Verification
- [ ] Open [crownedbyetty-frontend.vercel.app](https://crownedbyetty-frontend.vercel.app).
- [ ] Check if products load.
- [ ] Try a test order.
- [ ] Check if reviews appear.

---
*Created by Antigravity on 2026-02-16*
