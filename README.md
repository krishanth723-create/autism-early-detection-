# 🏥 AI-Driven Autism Early Detection & Screening System

An advanced Full-Stack Machine Learning application built to screen and predict early childhood autism patterns using the Q-CHAT-10 questionnaire. The application utilizes a highly responsive 3-tier architecture with real-time ML inference.

---

## 🏗️ Project Architecture & Tech Stack

The application is structured into modular layers ensuring scalability and seamless communication:

*   **Frontend UI (Vite + React.js):** Engineered with React, TypeScript, and optimized utilizing modern utility configurations through **Tailwind CSS v4** + **PostCSS** for a responsive, clean medical-grade questionnaire wizard interface.
*   **Backend REST API (FastAPI):** Asynchronous Python web application framework that acts as the core gateway, accepting secure request data and piping inputs directly to the ML engine.
*   **Machine Learning Engine (Scikit-Learn):** Powered by a **Random Forest Classifier** trained on screening indicators to deliver exact risk probability percentages instantly (`model.predict_proba()`).

---

## ⚙️ How it Works (System Workflow)

1. **Screening Phase:** Parents answer 10 intuitive behavioral questions via a progressive dynamic UI form.
2. **Data Pipeline:** Upon submission, the frontend transforms answers into a standardized binary vector array (`[1, 0, 1...]`) and ships it via an asynchronous HTTP POST payload to `/api/predict`.
3. **ML Inference:** The active FastAPI server loads the pre-compiled serialization artifact (`autism_model.joblib`) instantly into active memory during server execution.
4. **Diagnostic Display:** The Random Forest engine computes raw parameters, returning the final diagnostic risk level (High Risk/Low Risk) and exact probability markers back to the user view screen.

---

## 🚀 Installation and Local Deployment Guide

To execute and preview this application natively on your system, implement the sequence configurations across two distinct command prompts:

### 🐍 1. Backend & Machine Learning Pipeline Setup
Ensure your local Python ecosystem environment pathing is activated correctly inside the `backend` directory.

```bash
# Navigate to the backend space
cd backend

# Initialize and activate the local isolated environment
python -m venv venv
call venv\Scripts\activate

# Install compiled dependencies safely
pip install -r requirements.txt

# Execute data assembly to build and serialize your model artifact
python app/train_model.py

# Launch the asynchronous FastAPI gateway server
uvicorn app.main:app --reload --port 8000
```

### 🌐 2. Frontend React UI Deployment
Launch a separate execution terminal and initialize the client-side module manager.

```bash
# Navigate to the user interface bundle folder
cd frontend

# Bootstrap the package configurations and libraries
npm install

# Start the active development compiler
npm run dev
```
Open **`http://localhost:5173`** in your browser to interact with the application dashboard.
