# TalentIQ — AI-Powered HR Screening Portal
### Multi-User Team Edition

Browser-based HR screening powered by **Groq + Llama 3.3 70B** (free) and **Supabase** (free). No backend server. Supports multiple HR users with fully shared screening data.

---

## How Multi-User Works

```
HR Person 1 (Priya)    HR Person 2 (Rahul)    HR Person 3 (Sneha)
  Own login              Own login              Own login
  Own Groq key           Own Groq key           Own Groq key
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Supabase Database  │
                    │   (shared, free)     │
                    │                      │
                    │  All screenings      │
                    │  visible to ALL      │
                    │  3 HR members        │
                    └──────────────────────┘
```

- **Separate logins** — each HR signs in with their own email + password
- **Shared screenings** — if Priya runs a screening, Rahul and Sneha can open and view it
- **"Created by" tag** — every screening card shows who ran it
- **Per-person Groq key** — each HR sets their own free key in their own browser
- **Team Activity tab** — see per-HR stats (screenings, candidates, avg score)

---

## Cost — Everything Free

| Component | Service | Cost |
|---|---|---|
| AI / NLP | Meta Llama 3.3 70B via Groq | **Free** |
| Database + Auth | Supabase | **Free** |
| PDF/DOCX parsing | PDF.js + Mammoth.js (browser CDN) | Free |
| Frontend | React 18 (CDN, no build step) | Free |
| Hosting | GitHub Pages / Netlify | Free |

**Total: ₹0 / $0. No credit cards anywhere.**

---

## Setup Guide

### Step 1 — Supabase (5 minutes)

1. [supabase.com](https://supabase.com) → **Start your project** → sign up free
2. **New Project** → name it → set a DB password → **Create**
3. Wait ~1 min to spin up
4. **Project Settings** (gear icon) → **API** → copy:
   - **Project URL** (e.g. `https://abcxyz.supabase.co`)
   - **anon / public key** (starts with `eyJ...`)
5. **SQL Editor** → **New Query** → paste all of `supabase_setup.sql` → **Run**

> Share the same Supabase URL + anon key with all HR members. The anon key is safe to share — it's designed to be public.

### Step 2 — First-Time App Setup

1. Open `index.html` in browser
2. **Connect Supabase** screen → paste URL + anon key → **Save & Continue**
3. **Create Account** → name, work email, password
4. **Settings** → paste your free Groq key (`gsk_...`)

### Step 3 — Each HR Member Does the Same

Every HR member on their own device:
1. Opens `index.html` (or hosted URL)
2. Enters the same Supabase URL + anon key
3. Creates their own account (different email/password)
4. Sets their own Groq API key in Settings

### Get a Free Groq Key

1. [console.groq.com](https://console.groq.com) → sign up free (no credit card)
2. **API Keys** → **Create API Key** → copy (`gsk_...`)
3. TalentIQ → **Settings** → paste → **Save**

---

## File Structure

```
talentiq/
├── index.html           ← Complete app — just open in browser
├── supabase_setup.sql   ← Run ONCE in Supabase SQL Editor
├── README.md            ← This file
├── server.js            ← Optional Node.js proxy for team deploy
├── package.json
└── .env.example
```

---

## Supabase Permissions

| Action | Who |
|---|---|
| Read all screenings | Any logged-in HR user |
| Create a screening | Any logged-in HR user |
| Edit / Delete | Only the creator |

---

## Hosting for the Team

**GitHub Pages:**
Push `talentiq/` to a GitHub repo → Settings → Pages → deploy from main.

**Netlify:**
Drag & drop the `talentiq/` folder at [netlify.com/drop](https://app.netlify.com/drop).

Both are free. Share the URL with your HR team.

---

## Groq Free Limits (per HR member)

| Limit | Value |
|---|---|
| Requests / day | 1,000 (~20 full screenings of 50 resumes) |
| Tokens / minute | 6,000 (batch-of-3 logic handles this) |
| Tokens / day | 500,000 |

Each HR member uses their own key — limits are per-person, not shared.

