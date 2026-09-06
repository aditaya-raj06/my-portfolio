# High-Impact Developer Portfolio with Real-Time GitHub Sync & Backend API

A modern, fast, and metric-driven portfolio website and backend engine designed for software engineers, full-stack developers, and AI engineers. Engineered with a dual-mode architecture: runs as a full Node.js + Express backend service with real-time GitHub auto-sync, or as an ultra-fast static site.

---

## ✨ Flagship Highlights

- **⚡ Real-Time GitHub Auto-Sync**: Automatically ingests all your public GitHub repositories, stars, language tags, and project descriptions in real-time. If you create, edit, or delete a repository on GitHub, your portfolio updates dynamically!
- **📬 Essential Backend APIs**:
  - **`GET /api/portfolio`**: Delivers live synced GitHub projects with smart category inference and impact metrics.
  - **`POST /api/contact`**: Validates visitor inquiries and safely records messages in `server/data/messages.json`.
  - **`POST /api/webhook/github`**: GitHub webhook listener for instantaneous push/delete cache re-synchronization.
  - **`GET /api/analytics`**: Real-time visitor presence and server health metrics.
- **🛡️ Resilient Dual-Mode Hybrid Architecture**:
  - Works with the full Node.js backend server on Render, Railway, Vercel, or local machine.
  - Also includes client-side fallback to GitHub's public REST API if hosted statically on GitHub Pages!
- **🎨 Aesthetic Excellence**: Deep Obsidian dark theme with ambient neon glows, glassmorphism (`backdrop-filter: blur`), and micro-interactions.
- **🖥️ Interactive Developer CLI Terminal**: Functional terminal allowing technical evaluators to run `help`, `about`, `skills`, `projects`, `contact`, and `clear`.
- **🕒 Live Timezone Clock**: Real-time IST presence clock in the Bento Grid.
- **💬 Interactive Contact Form**: Full AJAX submission with loading state, anti-spam validation, and instant feedback toast.

---

## 🚀 Quick Start (Running Locally)

### 1. Start the Full Node.js Backend Server
```bash
# Install dependencies
npm install

# Start production server
npm start

# Or start in watch/development mode
npm run dev
```

The application will be live at:
- **Web App**: `http://localhost:3001`
- **Live Sync API**: `http://localhost:3001/api/portfolio`
- **Contact API**: `http://localhost:3001/api/contact`
- **Health Check**: `http://localhost:3001/health`

---

## ⚡ Setting up GitHub Instant Auto-Sync (Webhook)

When you deploy this portfolio backend to a live URL (e.g. on Render, Railway, or Vercel):
1. Go to your GitHub profile or repository settings.
2. Navigate to **Webhooks** -> **Add webhook**.
3. Set **Payload URL** to:
   `https://your-portfolio-domain.com/api/webhook/github`
4. Set **Content type** to `application/json`.
5. Select **Send me everything** (or *Pushes* and *Repositories*).
6. Click **Add webhook**.

Now, whenever you push code, create a new project, or delete a repository on GitHub, GitHub will instantly ping your portfolio and update it in real-time!

---

## 🌐 Deployment Options

### Option A: Full Backend Deployment (Recommended)
Deploy directly on **Render**, **Railway**, or **Vercel**:
- Build Command: `npm install`
- Start Command: `npm start`
- Root Directory: `./`

### Option B: Static Deployment (GitHub Pages)
1. Go to your repository settings on GitHub.
2. Under **Pages**, select **Branch: main** and folder **/(root)**.
3. Click **Save**. The client-side live sync engine will automatically query the GitHub API directly from the browser!

---

## 📄 License
MIT License © 2026 Aditaya Raj.
