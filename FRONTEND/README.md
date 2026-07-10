# AI-First CRM HCP Module

## Project Overview

This project is developed as part of the AIVOA.AI Full Stack Developer Assignment.

The application is an AI-powered CRM module designed for Healthcare Professional (HCP) interaction management. It enables field representatives to log interactions using either a structured form or an AI-assisted chat interface.

The AI agent is implemented using LangGraph and Groq LLM. It extracts important details from natural language, fills the interaction form automatically, and provides additional sales support features.

---

## Features

### 1. Log Interaction
- Enter interaction details manually or through AI chat.
- AI extracts:
  - HCP Name
  - Interaction Type
  - Date
  - Time
  - Location
  - Topics Discussed
  - Sentiment
  - Outcomes
  - Follow-up Actions

### 2. Edit Interaction
- Modify previously saved interaction records.
- Update meeting details whenever required.

### 3. Search Interaction
- Search interactions using HCP name or interaction type.
- Retrieve previous discussion history.

### 4. Summarize Interaction
- AI generates a concise summary of interaction notes.
- Helps sales representatives quickly review previous meetings.

### 5. Follow-up Recommendation
- AI suggests appropriate next actions based on previous interactions.
- Assists representatives in planning future meetings.

---

# Tech Stack

## Frontend

- React
- Redux
- Material UI

## Backend

- Python
- FastAPI

## AI

- LangGraph
- Groq API
- Llama 3.3 / GPT-OSS (used as replacement if Gemma model is unavailable)

## Database

- MySQL

---

# Project Structure

```

project/

│

├── frontend/

│ ├── components/

│ ├── pages/

│ ├── redux/

│ └── services/

│

├── backend/

│ ├── routes.py

│ ├── langgraph_agent.py

│ ├── models.py

│ └── database.py

│

└── README.md

```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

# LangGraph Workflow

```
User Input

↓

LangGraph Agent

↓

LLM Processing

↓

Entity Extraction

↓

Form Auto Fill

↓

Save to Database

↓

Search / Edit / Summary / Follow-up
```

---

# Database

The interaction data is stored in MySQL.

Main fields include:

- HCP Name
- Interaction Type
- Date
- Time
- Location
- Attendees
- Topics
- Sentiment
- Outcomes
- Follow-up Actions

---

# Future Improvements

- Voice-based interaction logging
- Authentication and authorization
- Dashboard analytics
- Email reminders
- Meeting calendar integration

---

# Author

Prateeksha Pandey

B.Tech CSE (2026)

