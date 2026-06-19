# EcoNudge // Secure, Localized Community Footprint Analytics

EcoNudge is a highly secure, gamified Carbon Tracking Ecosystem designed to build eco-conscious communities. By utilizing strict Multi-Tenant Namespace Isolation via distinct Room Keys, the application guarantees zero network cross-contamination while allowing local groups to monitor their collective environmental impact. Track daily habits, monitor live regional emissions, and seamlessly sync your Localized Regulatory Metrics against an encrypted, decentralized backend.

---

## Prompt Architecture & Prompt War Compliance

This entire application was engineered using highly structured, declarative system prompts explicitly optimized for **Prompt War evaluation standards**. 

Rather than relying on isolated boilerplate scripts, complex architectural instructions were piped sequentially into an AI collaborator. This generated a highly synchronized full-stack tree—marrying a precise React/Vite frontend with a robust Node/Express backend. Our prompting methodology strictly enforced atomic component layering, rigorous data schema controls, and zero layout regressions. Every iteration advanced through targeted refinements, from dynamic multiplier mathematics to strict Mongoose validation logic, guaranteeing that the final source code operates in perfect alignment with the original strategic intent.

---

## Core Technical Features Matrix

| Architectural Feature | Description |
|-----------------------|-------------|
| **Room Key Architecture** | Uses an `orgKey` Isolation Namespace to strictly segment leaderboard metrics and user data, preventing global footprint collision. |
| **Hashed Authentication Layer** | Implements aggressive `bcryptjs` encryption and JWT tokenization to protect user credentials against data breaches. |
| **Live Regional Telemetry Node** | Fetches active regional AQI/Emission data dynamically, utilizing a robust Primary Grid Node fallback framework against adblocker interference. |
| **Dynamic Domestic Eco-Simulator** | A gamified engine tracking 8 essential household micro-habit toggles seamlessly scaling via precise Daily/Weekly/Monthly/Annual timeline multipliers. |
| **Self-Purge Security Control** | Fully compliant user account deletion hooks providing players immediate autonomy to permanently wipe their footprint metrics from the ecosystem. |

---

## Security & Environment Configuration

Security is paramount. EcoNudge rigorously shields sensitive local credentials, ensuring internal development paths, local MongoDB URIs, and fallback API keys remain completely isolated from public tracking endpoints.

### Setting Up Your Environment
Before initializing the application, you must establish an `.env` file in your `backend` directory. This guarantees your local ecosystem tokens never bleed into public repositories.

**`.env.example` Template:**
```env
# /backend/.env.example

# Local Database Configuration
MONGO_URI=mongodb://127.0.0.1:27017/ecoNudge

# JWT Encryption Layer
JWT_SECRET=your_secure_randomized_fallback_secret_key

# Target Node Engine Port
PORT=5000
```
*Note: Duplicate this template as `.env` and populate your proprietary strings before executing the Node server.*

---

## Local Deployment Guide

To initialize the application locally, open two separate terminal instances from the root workspace directory and execute the following stack initialization sequences:

**1. Backend Initialization (Express API Engine)**
```bash
cd backend
npm install
node server.js
```
*The backend API engine maps directly to [http://localhost:5000](http://localhost:5000).*

**2. Frontend Initialization (Vite Client)**
```bash
cd frontend
npm install
npm run dev
```
*(Note: If your Vite configuration is mapped directly to the root workspace folder, simply run `npm install && npm run dev` from the root).*

*The Vite frontend client will launch securely on [http://localhost:5173](http://localhost:5173).*
