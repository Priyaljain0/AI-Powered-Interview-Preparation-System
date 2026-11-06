# AI-Powered Interview Preparation System

An AI-powered interview preparation platform that helps candidates practice technical interview questions and receive structured, AI-generated feedback on their answers.

## Features

- Technical interview question management
- AI-powered interview answer evaluation
- Criterion-wise assessment and scoring
- Strengths and missing concepts identification
- Personalized learning recommendations
- Improved answer suggestions
- MongoDB Atlas database integration
- Semantic search using MiniLM embeddings
- MongoDB Atlas Vector Search implementation
- Interactive Next.js frontend

## Tech Stack

**Frontend:** Next.js, React, TypeScript, Tailwind CSS

**Backend:** Python, FastAPI, Pydantic

**Database:** MongoDB Atlas

**AI/ML:** Ollama, Qwen, Sentence Transformers (MiniLM)

**Retrieval:** MongoDB Atlas Vector Search

## Project Structure

```text
AI-Powered-Interview-Preparation-System/
├── backend/
│   ├── main.py
│   ├── llm_service.py
│   ├── add_embeddings.py
│   └── test_vector_search.py
│
├── frontend/
│   ├── app/
│   ├── public/
│   └── package.json
│
├── .gitignore
└── README.md
```

## Running Locally

### Backend

```bash
cd backend
python -m venv .venv
pip install -r requirements.txt
uvicorn main:app --reload
```

Create a local `.env` file containing your MongoDB connection string.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Current Development Status

The core interview workflow, structured LLM evaluation, and MongoDB Atlas Vector Search have been implemented and tested.

The RAG pipeline integration, retrieval optimization, and advanced hallucination control are currently in development.

## Future Enhancements

- Retrieval-Augmented Generation (RAG)
- Voice-based interview practice
- Speech-to-text integration
- Facial expression analysis
- Advanced evaluation and feedback
