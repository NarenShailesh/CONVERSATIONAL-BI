# 💬 Conversational BI: Natural Language Interface to Business Dashboards

## 🌟 Project Overview

This project implements a sophisticated **Conversational Business Intelligence (BI)** solution using a modular Python stack. It transforms raw data files (CSV/Excel) uploaded by a user into a dynamic, queryable database, allowing non-technical users to ask complex analytical questions using **natural language (text or voice)** in **multiple languages**.

The core innovation lies in the integration of the **Gemini LLM** with LangChain Agents to handle multi-turn context, generate dynamic SQL queries on-the-fly against the user's data, and automatically create interactive **Plotly visualizations** based on the analytical result.

---

## 🛠️ Key Features

* **File Upload & Dynamic Data Ingestion:** Users upload their own CSV/Excel files, which are immediately loaded into a session-specific **SQLite** table for analysis.
* **Gemini-Powered Analysis:** The **Gemini 2.5 Flash** model acts as the BI analyst, converting natural language questions into complex, validated SQL queries.
* **Multi-Turn Conversation:** Uses **LangChain Memory** and Flask sessions to retain conversation context, enabling follow-up questions like "What about last month?"
* **Multilingual Support:** Accepts and responds to queries in multiple languages (e.g., Spanish, French, Tamil) while maintaining the English database schema internally.
* **Dynamic Visualization:** Automatically selects the best chart type (**Bar, Line, Pie**) for the query result and renders an interactive **Plotly** chart directly in the browser.
* **Voice Module:** Integrated client-side Speech-to-Text (STT) for a hands-free conversational experience.

---

## 🏗️ Architecture Stack

| Component | Role | Technology |
| :--- | :--- | :--- |
| **Frontend (View)** | User Interface (Chat, File Upload, Rendering) | HTML5, CSS, JavaScript (Web Speech API, Plotly.js) |
| **Backend (Controller)** | Routes, Session Management, API Logic | **Flask** (Python Microframework), `flask-session` |
| **AI/Agent (Model)** | Reasoning, Orchestration, Tool Use | **Gemini 2.5 Flash**, **LangChain Agent Executor** |
| **Data Layer** | Dynamic Storage of User Data | **Pandas** (File Reading), **SQLAlchemy/SQLite** (Querying) |
| **Visualization** | Interactive Chart Generation | **Plotly** (Python library) |

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

1.  **Python 3.9+**
2.  **Gemini API Key:** Get your key from Google AI Studio.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [YOUR-REPO-URL]
    cd conversational-bi-assistant
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install Flask flask-session python-dotenv pandas openpyxl sqlalchemy plotly langchain langchain-google-genai werkzeug
    ```

4.  **Set Environment Variables:**
    Create a file named `.env` in the project root and add your API key:
    ```
    # .env
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
    FLASK_SECRET_KEY="A_SUPER_SECRET_RANDOM_STRING"
    ```

### Running the Application

1.  **Run the Flask application:**
    ```bash
    python app.py
    ```

2.  **Access the App:**
    Open your browser and navigate to: `http://127.0.0.1:5000/`

---

## 📖 Usage Flow

1.  **Home Page (`/`):** Introductory information.
2.  **Analyze Page (`/analyze`):**
    * Use the **Upload Form** to select a CSV or Excel file. The backend processes this file into a temporary SQLite table.
    * Once uploaded, ask questions in the chat interface.
    * Click the **🎤 Voice Input** button to speak your query.
3.  **History Page (`/history`):** View all past conversations logged under your current browser session.

---

## 📁 File Structure

The project is designed to be modular, although provided as a single monolithic file for simplicity.
