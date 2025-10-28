# Synthetic Personas - Deployment Guide

## 🎉 Development Complete!

The Synthetic Personas application has been successfully developed and is ready for deployment.

## ✅ What's Been Completed

### Phase 1: Foundation ✅
- ✅ Turborepo monorepo created
- ✅ Next.js webapp initialized
- ✅ Supabase linked (Project: `lemjvnqnbxqbjpvcvjdz`)
- ✅ TypeScript types generated from Supabase schema
- ✅ GitHub repository created: https://github.com/pottsa12/Synthetic-Persona
- ✅ Google Cloud project created: `synthetic-personas-476518`

### Phase 2: AI Agent ✅
- ✅ FastAPI server with multimodal Gemini 1.5 Pro support
- ✅ Text, image, and video input capabilities
- ✅ Dockerfile created for Cloud Run deployment
- ✅ requirements.txt with all dependencies
- ✅ Health check and monitoring endpoints

### Phase 3: Frontend ✅
- ✅ Next.js 16 with React 19
- ✅ Tailwind CSS 4 with purple theme (audience-canvas style)
- ✅ shadcn-ui components (Button, Card, Select, Input, Textarea)
- ✅ AudienceSelector component with Supabase integration
- ✅ Multimodal chat interface with file upload UI
- ✅ API route for secure backend communication
- ✅ Responsive design with mobile support

---

## 🚀 Next Steps for Deployment

### Step 1: Enable Google Cloud Billing (REQUIRED)

The AI agent deployment requires a billing account:

1. Go to: https://console.cloud.google.com/billing
2. Link a billing account to project `synthetic-personas-476518`
3. New Google Cloud users get $300 free credit

### Step 2: Deploy AI Agent to Google Cloud Run

Once billing is enabled, run:

```bash
cd /Users/alexanderpotts/Documents/GitHub/synthetic-personas-monorepo

# Enable required APIs
~/google-cloud-sdk/bin/gcloud services enable aiplatform.googleapis.com run.googleapis.com cloudbuild.googleapis.com

# Deploy to Cloud Run
~/google-cloud-sdk/bin/gcloud run deploy synthetic-persona-agent \
  --source ./apps/ai-agent \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GCLOUD_PROJECT=synthetic-personas-476518,GCLOUD_LOCATION=us-central1
```

**Save the Service URL** from the output (e.g., `https://synthetic-persona-agent-xxxxx-uc.a.run.app`)

### Step 3: Update Environment Variables

Update the AI agent URL in the frontend:

```bash
cd apps/webapp
# Edit .env.local and replace AI_AGENT_URL with the Cloud Run URL
```

### Step 4: Deploy Frontend to Vercel

```bash
cd /Users/alexanderpotts/Documents/GitHub/synthetic-personas-monorepo

# Link to Vercel (first time only)
vercel link

# Set environment variables in Vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Value: https://lemjvnqnbxqbjpvcvjdz.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlbWp2bnFuYnhxYmpwdmN2amR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA4NTEyMzcsImV4cCI6MjAyNjQyNzIzN30.VhAr6cJdNHNW5UQ88_sJ7a4bCKzHXGE3pCJ9xqAhMqo

vercel env add AI_AGENT_URL production
# Value: <YOUR_CLOUD_RUN_URL_FROM_STEP_2>

# Deploy to production
vercel --prod
```

---

## 🧪 Local Development

### Frontend (Next.js)

```bash
cd /Users/alexanderpotts/Documents/GitHub/synthetic-personas-monorepo
pnpm install
pnpm dev
```

Visit: http://localhost:3000

### AI Agent (FastAPI)

```bash
cd /Users/alexanderpotts/Documents/GitHub/synthetic-personas-monorepo/apps/ai-agent

# Activate virtual environment
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export GCLOUD_PROJECT=synthetic-personas-476518
export GCLOUD_LOCATION=us-central1

# Run server
uvicorn main:app --reload --port 8080
```

Visit: http://localhost:8080 (API health check)

---

## 📁 Project Structure

```
synthetic-personas-monorepo/
├── apps/
│   ├── webapp/                # Next.js frontend
│   │   ├── app/              # Next.js App Router
│   │   │   ├── api/chat/     # API routes
│   │   │   ├── globals.css   # Tailwind styles
│   │   │   └── page.tsx      # Main chat interface
│   │   ├── components/       # React components
│   │   │   ├── ui/          # shadcn-ui components
│   │   │   └── AudienceSelector.tsx
│   │   └── lib/             # Utilities
│   │       ├── database.types.ts  # Supabase types
│   │       ├── supabaseClient.ts  # Supabase client
│   │       └── utils.ts           # Helper functions
│   │
│   └── ai-agent/             # Python FastAPI backend
│       ├── main.py           # FastAPI app
│       ├── requirements.txt  # Python dependencies
│       ├── Dockerfile        # Cloud Run config
│       └── .env.example      # Environment template
│
├── packages/                 # Shared packages
└── README.md
```

---

## 🎯 Features

### Multimodal Input
- ✅ Text prompts
- ✅ Image uploads (JPEG, PNG, etc.)
- ✅ Video uploads (MP4, etc.)

### Persona Simulation
- ✅ 71 audience personas from Supabase
- ✅ Dynamic persona selection
- ✅ Context-aware responses

### UI/UX
- ✅ Purple gradient theme
- ✅ Responsive design
- ✅ File preview and removal
- ✅ Loading states
- ✅ Error handling

---

## 🔧 Configuration Files

### Environment Variables

**Frontend** (`apps/webapp/.env.local`):
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase public API key
- `AI_AGENT_URL`: Cloud Run service URL

**AI Agent** (Cloud Run environment):
- `GCLOUD_PROJECT`: Google Cloud project ID
- `GCLOUD_LOCATION`: Deployment region (us-central1)

---

## 📊 Database Schema

### `audiences` Table (Supabase)
- `id` (integer, primary key)
- `audience_name` (text, required)
- `audience_summary` (text, nullable) - **Used for persona prompts**
- `upload_date` (timestamp)
- `created_at` (timestamp)

---

## 🐛 Troubleshooting

### Issue: "AI_AGENT_URL is not configured"
**Solution**: Deploy the AI agent first, then update the environment variable.

### Issue: "Failed to get response from agent"
**Solution**: Check that:
1. Cloud Run service is deployed and running
2. AI_AGENT_URL is correct in Vercel environment
3. Google Cloud billing is enabled

### Issue: "No audiences loading"
**Solution**: Verify:
1. Supabase URL and keys are correct
2. `audiences` table has data with `audience_summary` populated
3. Row-level security (RLS) is disabled or configured correctly

---

## 📚 Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4, shadcn-ui |
| Backend | Python 3.11, FastAPI |
| AI Model | Google Gemini 1.5 Pro (Vertex AI) |
| Database | Supabase (PostgreSQL) |
| Hosting | Vercel (Frontend), Cloud Run (Backend) |
| Monorepo | Turborepo, pnpm |

---

## 🎓 Key Files to Review

1. **AI Agent**: [apps/ai-agent/main.py](apps/ai-agent/main.py)
2. **Chat Interface**: [apps/webapp/app/page.tsx](apps/webapp/app/page.tsx)
3. **API Route**: [apps/webapp/app/api/chat/route.ts](apps/webapp/app/api/chat/route.ts)
4. **Audience Selector**: [apps/webapp/components/AudienceSelector.tsx](apps/webapp/components/AudienceSelector.tsx)

---

## ✨ What Makes This Special

1. **True Multimodal**: Not just text - users can show products, ads, or brand materials via images/video
2. **Authentic Personas**: Powered by real audience data from Supabase
3. **Production-Ready**: Full error handling, loading states, responsive design
4. **Scalable**: Serverless architecture on Cloud Run and Vercel
5. **Type-Safe**: End-to-end TypeScript with Supabase schema generation

---

## 📝 Notes

- The Python virtual environment (`.venv`) was committed for convenience but can be excluded via `.gitignore` in production
- All sensitive keys are in `.env.local` which is gitignored
- The application uses Google's latest Gemini 1.5 Pro model for best multimodal performance

---

**Need Help?** Open an issue on the [GitHub repository](https://github.com/pottsa12/Synthetic-Persona)
