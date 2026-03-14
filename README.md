# EchoElders

**AI companion calls for aging loved ones — companionship, medication reminders, and memory capture.**

EchoElders helps families care for seniors through scheduled AI phone conversations. Caregivers set up a profile (medications, routines, life stories). The AI calls the elder — or you start an **in-browser demo call** from the dashboard — to provide companionship, gentle medication reminders, and to capture memories. After each call, caregivers get a summary: mood, medication adherence, and any concerns.

Built for the **GenAI Genesis Hackathon** (Next.js, Supabase, VAPI, Anthropic/Claude, ElevenLabs).

---

## Which number does VAPI call?

- **In-browser (current demo):** When you click **Start call** on the dashboard or elders list, the call runs **in your browser** (mic + speakers). **No phone number is called.** You’re talking to the AI directly on your device. The elder’s `phone` in the database is **not** used in this flow.
- **Outbound phone calls (optional):** The backend has an API route `POST /api/call` that uses VAPI’s **phone** product. If you trigger that (e.g. a future “Call their phone” button), then:
  - **VAPI calls the elder’s phone number** (`elder.phone` from Supabase).
  - The call is placed **from** the VAPI phone number linked to `VAPI_PHONE_NUMBER_ID` **to** the elder’s number.
  So for real phone calls, the number that gets called is the **elder’s** number stored in the database.

---

## Quick start

### Prerequisites

- Node.js 20+
- Accounts: [Supabase](https://supabase.com), [VAPI](https://dashboard.vapi.ai), [Anthropic](https://console.anthropic.com), [ElevenLabs](https://elevenlabs.io) (for voice)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd genesis-genai/frontend
npm install
```

### 2. Environment variables

Copy the example env and fill in your values:

```bash
cp .env.example .env.local
```

Required for the app:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `NEXT_PUBLIC_VAPI_PUBLIC_KEY` | VAPI **public** key (for in-browser calls) |
| `NEXT_PUBLIC_VAPI_ASSISTANT_ID` | VAPI assistant ID (same as in dashboard) |

Optional (for outbound phone calls via `/api/call`):

- `VAPI_API_KEY` — VAPI API key (server)
- `VAPI_PHONE_NUMBER_ID` — VAPI phone number to call from

### 3. Database (Supabase)

In the Supabase SQL Editor, run the schema that creates `elders`, `call_logs`, and `memories` (see hackathon checklist or `docs/` if you have it). Then add at least one elder (or use “Add elder” in the app).

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You’ll see the elders list; use **Start call** for an in-browser demo call (grant mic when prompted).

---

## Project structure

```
genesis-genai/
├── frontend/                 # Next.js app
│   ├── app/
│   │   ├── api/              # API routes (call, webhook, elders)
│   │   ├── lib/              # Supabase & VAPI helpers
│   │   ├── types/
│   │   └── page.tsx
│   ├── components/
│   │   ├── vapi-call-provider.tsx  # VAPI Web SDK (in-browser calls)
│   │   ├── elders-list.tsx
│   │   ├── dashboard.tsx
│   │   └── registration-flow.tsx
│   └── .env.example
└── README.md
```

- **Elders list** — Loads elders from Supabase via `GET /api/elders`; **Start call** uses the VAPI Web SDK (no phone number).
- **Dashboard** — Single-elder view with **Start call** (same in-browser flow) and **Back to list**.
- **Registration** — “Add elder” flow; saves to Supabase via `POST /api/elders`.

---

## VAPI setup (summary)

1. Create an assistant in [VAPI Dashboard](https://dashboard.vapi.ai) with system prompt using variables like `{{elder_name}}`, `{{elder_age}}`, `{{biography}}`, `{{medications}}`.
2. For **in-browser demo**: add your **public** key and **assistant ID** to `NEXT_PUBLIC_VAPI_*` in `.env.local`.
3. For **phone calls**: add a phone number in VAPI, set `VAPI_PHONE_NUMBER_ID`, and call `POST /api/call` with `{ elderId }`; VAPI will call the **elder’s** phone number.

---

## 30-second pitch

*“EchoElders helps families care for aging loved ones through AI phone conversations. Caregivers set up a profile with medications, routines, and life stories. Our AI calls the elder at scheduled times — reminding about medications, providing companionship, and capturing memories. After each call, caregivers get a summary: mood, medication adherence, and any concerns. Over time we build a living memory archive. We’re not just reducing loneliness; we’re preserving a person before time erases the details.”*

---

## License

MIT (or your choice).
