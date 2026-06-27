# YoChat: Windows Installation & Setup Guide

This guide describes how to run **YoChat**—your real-time English speaking teacher avatar app—locally on a Windows machine using **Python FastAPI** for the backend and **React (Vite)** for the frontend.

---

## Prerequisites

Before starting, make sure you have the following installed on your Windows machine:

1. **Python 3.10+** (Ensure you check the option **"Add Python to PATH"** during installation)
2. **Node.js (v18 or v20)** (Standard LTS version)
3. **Google Gemini API Key** (Get one for free from the [Google AI Studio Secrets Panel](https://aistudio.google.com/))

---

## Project Structure Overview

The project contains two main folders:
*   `/backend` - Contains the Python FastAPI server (`main.py`) which manages real-time audio streams with Gemini's Live API.
*   `/frontend` - Contains the React Vite client with the animated avatar visualizer, lesson selector, and PCM microphone capture.

---

## Step 1: Backend Setup (FastAPI)

1. Open your terminal of choice (e.g., **PowerShell**, **Command Prompt**, or **Git Bash**).
2. Navigate to the `backend` folder:
    ```bash
    cd backend
    ```
3. Create a Python virtual environment to keep your packages isolated:
    ```bash
    python -m venv venv
    ```
4. Activate the virtual environment:
    *   **In PowerShell:**
        ```powershell
        .\venv\Scripts\Activate.ps1
        ```
    *   **In standard Command Prompt:**
        ```cmd
        .\venv\Scripts\activate.bat
        ```
5. Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```
6. Set up your environment variables:
    *   Copy the `.env.example` file to create a `.env` file:
        ```bash
        copy .env.example .env
        ```
    *   Open the new `.env` file in Notepad or VS Code and paste your Gemini API key:
        ```env
        GEMINI_API_KEY="AIzaSyYourActualAPIKeyHere..."
        ```
7. Start the FastAPI server:
    ```bash
    uvicorn main:app --host 127.0.0.1 --port 8000 --reload
    ```
    *You should see a message saying: `INFO: Uvicorn running on http://127.0.0.1:8000`.*

---

## Step 2: Frontend Setup (React + Vite)

1. Open a **second** terminal window (leave the FastAPI server running in the first one!).
2. Navigate to the `frontend` folder:
    ```bash
    cd frontend
    ```
3. Install the node package dependencies:
    ```bash
    npm install
    ```
4. Start the React/Vite development server:
    ```bash
    npm run dev
    ```
5. Open your web browser and go to the local URL displayed in the terminal:
    ```
    http://localhost:5173
    ```

---

## Step 3: Start Practicing!

1. Pick a grade (6th or 7th Grade) and a lesson from the curriculum panel.
2. Click **Start Conversation**.
3. Accept the browser prompt asking for **Microphone Access**.
4. Once connected, look at the YoChat avatar and say: *"Hello YoChat!"* or ask a question.
5. YoChat will speak back to you slowly and clearly, guiding your English practice!

---

## Troubleshooting on Windows

*   **Microphone Not Recording:** Ensure that you have granted microphone permissions both in your browser settings (click the lock icon next to the address bar) and in Windows Privacy Settings (**Settings > Privacy & Security > Microphone**).
*   **Virtual Environment activation error in PowerShell:** If you get a restriction error running `Activate.ps1`, run PowerShell as Administrator and execute:
    ```powershell
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
    ```
    Then try activating again.
*   **Failed to connect to the backend:** Make sure the FastAPI backend is active and running on port `8000`. You can test this by visiting `http://localhost:8000/health` in your browser.
