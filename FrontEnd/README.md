# ✨ AI Builder — Turn Thoughts Into Websites, Instantly

**AI Builder** (aka *Ai-Protfolio*) is a full-stack AI website generator. Describe what you want in plain English — a portfolio, a landing page, a small business site — and get a fully designed, production-ready website in seconds. Keep refining it by chatting, then publish it with one click.

![status](https://img.shields.io/badge/status-active-brightgreen)
![license](https://img.shields.io/badge/license-MIT-blue)
![stack](https://img.shields.io/badge/stack-MERN-informational)

---

## 🖼️ Preview

> Add a screenshot or GIF of the app here once deployed:
> `![AI Builder preview](./docs/preview.png)`

---

## 🚀 Features

- **Prompt-to-website generation** — describe your idea, AI Builder generates a complete, styled site
- **Conversational refinement** — keep chatting to tweak copy, sections, and styling, no design skills needed
- **Live in-browser preview** — see changes rendered instantly in a sandboxed iframe
- **One-click publishing**
  - Deploy straight to **Vercel**
  - Push the generated site to a new **GitHub** repository (with optional GitHub Pages)
- **Dashboard** — manage all your projects, track activity/contribution history, search & filter
- **Community gallery** — browse and like sites other users have published
- **Credits & billing** — Stripe-powered checkout for buying generation credits, with purchase history
- **Full auth flow** — register with email OTP verification, login, forgot/reset password, profile settings, account deletion
- **Light & dark theme** — full app-wide theme toggle, persisted per user
- **Responsive UI** — works cleanly on mobile, tablet, and desktop

---

## 🧱 Tech Stack

**Frontend**
- React 19 + Vite
- React Router 7
- Tailwind CSS 4
- Lucide Icons / React Icons
- Axios, React Hot Toast

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT-based authentication
- Bcrypt password hashing
- Stripe (payments)
- Octokit (GitHub API integration)
- Vercel deployment API
- Brevo (transactional email for OTP/verification)

**AI**
- Gemini API for site generation
- Groq API
- Unsplash API for stock imagery

---

## 📂 Project Structure

```
AiBuilder/
├── BackEnd/
│   ├── config/            # DB connection
│   ├── controllers/       # Auth, projects, payments, community logic
│   ├── middleware/        # Auth guards
│   ├── models/            # User, Project, Payment schemas
│   ├── routes/            # REST API routes
│   ├── utils/             # AI generation, email, GitHub/Vercel deploy helpers
│   └── server.js
└── FrontEnd/
    ├── src/
    │   ├── assets/         # Shared styles, UI primitives
    │   ├── Components/     # Navbar, Footer, modals, route guards
    │   ├── context/        # Auth & Theme providers
    │   ├── Pages/           # Landing, Dashboard, Builder, Pricing, Auth, etc.
    │   └── utils/           # API client, safe preview sandbox
    └── vite.config.js
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB database (local or Atlas)
- API keys for: Gemini, Groq, Unsplash, Stripe, Brevo, and (optionally) GitHub/Vercel tokens

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/AiBuilder.git
cd AiBuilder
```

### 2. Backend setup
```bash
cd BackEnd
npm install
```

Create a `.env` file in `BackEnd/`:

```env
# Email (Brevo)
BREVO_API_KEY=
BREVO_SENDER_EMAIL=
BREVO_SENDER_NAME=

# Database
MONGODB_URI=

# Auth
JWT_SECRET=
JWT_EXPIRES_IN=

# Payments
STRIPE_SECRET_KEY=

# Deployment (optional — users can also paste their own tokens in-app)
VERCEL_TOKEN=
GITHUB_TOKEN=

# AI generation
GEMINI_API_KEY=
UNSPLASH_API_KEY=
GROQ_API_KEY=
```

Run the server:
```bash
npm start
```

### 3. Frontend setup
```bash
cd ../FrontEnd
npm install
npm run dev
```

The app will be available at `http://localhost:5173` (frontend) and connects to the backend API (default `http://localhost:5000` — update `src/utils/api.js` if different).

---

## 🗺️ Roadmap

- [ ] Custom domain support
- [ ] Team/workspace collaboration
- [ ] More export options (React, static HTML zip)
- [ ] Template marketplace

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to open an issue or submit a PR.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙋 Support

If you find this project useful, consider giving it a ⭐ on GitHub — it helps a lot!
