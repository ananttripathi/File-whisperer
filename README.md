# 📄 DocChat — Chat With Any Document

> Upload a PDF. Ask anything. Get expert answers — powered by AI.

Upload an airplane manual and get a flight support assistant. Upload the Merck Manual and get a medical reference expert. Upload a legal contract and get a document analyst. **DocChat turns any document into a conversational AI expert.**

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python)
![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=flat-square&logo=supabase)
![Gemini](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-4285F4?style=flat-square&logo=google)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)
![Hosted on Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=flat-square&logo=vercel)
![Hosted on Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render)

---

## 📸 Demo

> _Add a screenshot or GIF of your app here_

---

## ✨ Features

- 📤 Upload any PDF document (manuals, books, contracts, reports)
- 💬 Chat with your document in natural language
- 🧠 AI answers grounded only in your document — no hallucinations
- 📍 Source citations — see exactly which part of the doc the answer came from
- 🎭 Persona switching — acts as a medical expert, flight support, legal analyst, etc.
- 🔒 Bring Your Own Key — users can provide their own Gemini/OpenAI API key
- 🌙 Dark mode support
- 📱 Fully responsive UI

---

## 🧠 How It Works

This app uses a technique called **RAG (Retrieval Augmented Generation)**. Instead of relying on the AI's general training data, it grounds every answer in the content of your uploaded document.

```
 User uploads PDF
        ↓
 Document is parsed and split into chunks
        ↓
 Each chunk is converted to a vector (embedding)
        ↓
 Vectors are stored in a database
        ↓
 User asks a question
        ↓
 Question → vector → find most similar chunks
        ↓
 Relevant chunks + question → sent to Gemini
        ↓
 Gemini answers based only on the document ✅
```

> **MVP shortcut:** Gemini 1.5 Flash accepts entire PDFs as input natively, so for smaller documents you can skip the vector step entirely and send the whole PDF to the model directly.

---

## 🛠️ Tech Stack

| Layer | Technology | Hosted On | Cost |
|-------|-----------|-----------|------|
| Frontend | React 18 | [Vercel](https://vercel.com) | Free |
| Backend | Python + FastAPI | [Render](https://render.com) | Free |
| Database + Vector store | Supabase (pgvector) | [Supabase](https://supabase.com) | Free |
| File storage | Supabase Storage | [Supabase](https://supabase.com) | Free |
| AI model | Gemini 1.5 Flash | [Google AI](https://ai.google.dev) | Free tier |
| Embeddings | Gemini Embeddings | [Google AI](https://ai.google.dev) | Free tier |

**Total hosting cost: $0** for personal use and portfolio projects.

---

## 📁 Project Structure

```
docchat/
├── client/                          # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx       # Main chat UI
│   │   │   ├── MessageBubble.jsx    # Individual message component
│   │   │   ├── FileUploader.jsx     # Drag and drop file upload
│   │   │   ├── SourceCard.jsx       # Citation/source display
│   │   │   └── ApiKeyModal.jsx      # BYO API key input
│   │   ├── hooks/
│   │   │   └── useChat.js           # Chat state and logic
│   │   ├── services/
│   │   │   └── api.js               # Backend API calls
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── server/                          # FastAPI backend
│   ├── main.py                      # Entry point
│   ├── routers/
│   │   ├── upload.py                # File upload endpoints
│   │   └── chat.py                  # Chat/question endpoints
│   ├── services/
│   │   ├── pdf_parser.py            # Extract text from PDFs
│   │   ├── chunker.py               # Split text into chunks
│   │   ├── embeddings.py            # Generate vector embeddings
│   │   ├── vector_store.py          # Supabase pgvector operations
│   │   └── gemini.py                # Gemini API integration
│   ├── models/
│   │   └── schemas.py               # Pydantic request/response models
│   ├── db/
│   │   └── schema.sql               # Supabase table definitions
│   ├── requirements.txt
│   └── .env.example
│
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Python](https://www.python.org/) 3.11+
- A [Supabase](https://supabase.com) account (free)
- A [Google AI Studio](https://ai.google.dev) account for Gemini API key (free)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/docchat.git
cd docchat
```

---

### 2. Backend Setup

```bash
cd server
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create your `.env` file:

```bash
cp .env.example .env
```

Fill in the values:

```env
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_service_role_key
CORS_ORIGIN=http://localhost:5173
```

Start the backend:

```bash
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`. API docs available at `http://localhost:8000/docs`.

---

### 3. Database Setup (Supabase)

Run the following SQL in your Supabase SQL editor to enable pgvector and create the required tables:

```sql
-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Store uploaded documents
CREATE TABLE documents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename    TEXT NOT NULL,
  file_url    TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Store document chunks with their vector embeddings
CREATE TABLE chunks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id  UUID REFERENCES documents(id) ON DELETE CASCADE,
  content      TEXT NOT NULL,
  page_number  INTEGER,
  embedding    vector(768),       -- Gemini embedding dimension
  created_at   TIMESTAMP DEFAULT NOW()
);

-- Create an index for fast similarity search
CREATE INDEX ON chunks USING ivfflat (embedding vector_cosine_ops);
```

---

### 4. Frontend Setup

```bash
cd client
npm install
cp .env.example .env
```

Fill in your frontend `.env`:

```env
VITE_API_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## 📡 API Reference

### Upload a Document

```http
POST /api/upload
Content-Type: multipart/form-data
```

**Request:** Form data with a `file` field (PDF only, max 20MB)

**Response:**
```json
{
  "documentId": "uuid-here",
  "filename": "merck-manual.pdf",
  "pageCount": 342,
  "chunkCount": 891,
  "message": "Document processed successfully"
}
```

---

### Ask a Question

```http
POST /api/chat
Content-Type: application/json
```

**Request Body:**
```json
{
  "documentId": "uuid-here",
  "question": "What is the recommended dosage of ibuprofen for adults?",
  "persona": "medical expert",
  "history": [
    { "role": "user", "content": "previous question" },
    { "role": "assistant", "content": "previous answer" }
  ]
}
```

**Response:**
```json
{
  "answer": "According to the manual, the recommended adult dosage of ibuprofen is...",
  "sources": [
    {
      "pageNumber": 47,
      "excerpt": "The standard adult dose is 400mg every 4-6 hours..."
    }
  ],
  "confidence": "high"
}
```

---

### Get Document Info

```http
GET /api/documents/:documentId
```

**Response:**
```json
{
  "documentId": "uuid-here",
  "filename": "flight-manual.pdf",
  "pageCount": 210,
  "uploadedAt": "2025-01-15T10:30:00Z"
}
```

---

## 🎭 Persona Examples

The AI adapts its tone and expertise based on the document and persona:

| Document | Persona Prompt | AI Behaves Like |
|----------|---------------|-----------------|
| Airplane manual | `"You are an experienced flight support specialist"` | Airline technical support |
| Merck Manual | `"You are a knowledgeable medical reference expert"` | Medical professional |
| Legal contract | `"You are a careful legal document analyst"` | Legal assistant |
| Tax code | `"You are a precise tax advisor"` | Tax consultant |

---

## 🚢 Deployment (100% Free)

Deploy in this exact order:

### Step 1 — 🗄️ Database on [Supabase](https://supabase.com)

1. Create a free account and new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the schema from the Database Setup section above
3. Go to **Storage** → create a bucket called `documents` and set it to private
4. Copy your **Project URL** and **service role key** from Settings → API

### Step 2 — 🤖 Get Your Gemini API Key

1. Go to [ai.google.dev](https://ai.google.dev) → **Get API key**
2. Create a free API key — no credit card required
3. Free tier: **1,500 requests/day, 15 requests/minute**

### Step 3 — ⚙️ Backend on [Render](https://render.com)

1. Push your `server/` folder to GitHub
2. Sign up at [render.com](https://render.com) → **New Web Service** → connect your repo
3. Set **Runtime** to `Python`, **Start Command** to:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```
4. Add environment variables in the Render dashboard:
   ```env
   GEMINI_API_KEY=your_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_service_key
   CORS_ORIGIN=https://your-app.vercel.app
   ```
5. Deploy — you'll get a URL like `https://docchat-api.onrender.com`

> ⚠️ **Cold starts:** Free Render tier sleeps after 15 mins idle. First request takes ~30s to wake up.

### Step 4 — 🖥️ Frontend on [Vercel](https://vercel.com)

1. Update `client/.env` with your Render backend URL:
   ```env
   VITE_API_URL=https://docchat-api.onrender.com
   ```
2. Push your `client/` folder to GitHub
3. Sign up at [vercel.com](https://vercel.com) → **New Project** → import your repo
4. Set **Root Directory** to `client/`
5. Deploy — you'll get a URL like `https://docchat.vercel.app`

---

### 🔐 Environment Variable Checklist

| Variable | Local | Production |
|----------|-------|------------|
| `GEMINI_API_KEY` | Your Gemini key | Same (set in Render) |
| `SUPABASE_URL` | Your Supabase URL | Same (set in Render) |
| `SUPABASE_KEY` | Supabase service key | Same (set in Render) |
| `CORS_ORIGIN` | `http://localhost:5173` | Your Vercel URL |
| `VITE_API_URL` | `http://localhost:8000` | Your Render URL |

> **Never push `.env` files to GitHub.** Both `.env` files are already in `.gitignore`.

---

## 💸 Staying Within the Free Tier

| Limit | Free Allowance | Tips |
|-------|---------------|------|
| Gemini requests | 1,500/day | Each chat message = 1 request |
| Supabase DB | 50MB | ~500k chunks stored |
| Supabase Storage | 500MB | ~250 average PDFs |
| Render | 750 hrs/month | Enough for 1 service |
| Vercel | Unlimited | No limit on frontend |

**Pro tip:** Add a "Bring Your Own Key" (BYOK) option in settings where users paste their own Gemini API key. This means you never hit the limit, no matter how many users you have.

---

## 🗺️ Roadmap

- [x] PDF upload and parsing
- [x] RAG pipeline with Gemini
- [x] Source citations
- [x] Persona switching
- [ ] Multi-file support (chat across multiple documents)
- [ ] Chat history persistence
- [ ] User authentication
- [ ] Support for DOCX, TXT, and Markdown files
- [ ] Export chat as PDF
- [ ] Highlight source text in document viewer

---

## 🧪 Running Tests

```bash
# Backend tests
cd server
pytest

# Frontend tests
cd client
npm test
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> Built with ❤️ as a portfolio project. If this helped you, consider giving it a ⭐!
