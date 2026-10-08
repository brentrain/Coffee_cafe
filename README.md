# The Green Roast Co. ☕

A mobile-first, handcrafted artisan coffeehouse website featuring an integrated, local conversational AI barista ("Sam"). Designed with a late-90s/early-00s Global Village Coffeehouse (GVC) aesthetic using tactile paper-card layouts and a solid, earthy palette.

---

## 📋 System Requirements

Before setting up the project, make sure the following tools are installed on your machine:

- **Operating System:** macOS, Linux, or Windows (via WSL2 recommended)
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher (comes bundled with Node.js)
- **Ollama:** Latest version for running local language models
- **System Memory (RAM):** Minimum 8 GB RAM (16 GB recommended to smoothly run `llama3.2`)
- **Disk Space:** At least 4 GB free disk space for Node dependencies and the `llama3.2` model weights

---

## 📦 Dependencies

The application relies on the following production packages:

- **`express`** (`^4.19.0`): Minimalist Node.js web server handling the static frontend files and the AI chat endpoint.
- **`ollama`** (`^0.5.0`): Official JavaScript library used to communicate with the local Ollama instance.
- **`dotenv`** (`^16.4.0`): Loads configuration variables (such as custom ports or model names) from a `.env` file into `process.env`.

---

## 🛠️ Step-by-Step Installation Guide

Follow these steps in order to install and launch the project from scratch:

### 1. Install Node.js
If Node.js is not already installed on your system:
- **macOS (Homebrew):**
  ```bash
  brew install node
⚬	Linux (Debian/Ubuntu):
curl -fsSL [https://deb.nodesource.com/setup_20.x](https://deb.nodesource.com/setup_20.x) | sudo -E bash -
sudo apt-get install -y nodejs

⚬	Windows: Download the LTS installer directly from nodejs.org.
Verify your installation:
node -v
npm -v

2. Install Ollama
Download and install Ollama to manage and execute the local model:
⚬	macOS / Windows: Download the official standalone installer from ollama.com/download.
⚬	Linux: Run the official install script in your terminal:
curl -fsSL [https://ollama.com/install.sh](https://ollama.com/install.sh) | sh

Verify Ollama is installed:
ollama --version

3. Clone or Set Up the Project Directory
Clone the repository from GitHub:
git clone [https://github.com/YOUR-USERNAME/coffee-ai-cafe.git](https://github.com/YOUR-USERNAME/coffee-ai-cafe.git)
cd coffee-ai-cafe

4. Install Node Dependencies
Run the package installation command inside the root project directory:
npm install express dotenv ollama

5. Pull and Launch the Local Model
Start the Ollama background daemon service (if not already running through your desktop menu):
ollama serve

In a separate terminal window, download and launch the llama3.2 model:
ollama run llama3.2

Note: Once the model finishes pulling and the interactive >>> prompt appears, type /bye and press Enter to exit back to your regular shell. The model is now cached and ready for the backend to use.
6. Start the Application Server
Run the Express backend:
node server.js

You should see confirmation output in your terminal:
The Green Roast Co. server running at http://localhost:3000
AI Barista engine connected to Ollama (llama3.2)

Open your browser and navigate to:
http://localhost:3000

📂 Project Structure
coffee-ai-cafe/
├── public/
│   └── index.html     # Single-file frontend (HTML structure, responsive CSS, and client-side chat logic)
├── server.js          # Express server hosting static assets and the Ollama chat endpoint (/api/chat)
├── .gitignore         # Prevents node_modules/, .env, and OS system files from being tracked
├── package.json       # Node package configuration, dependency list, and scripts
└── README.md          # Complete project documentation, requirements, and installation guide

☕ Barista Personality & Behavior
The digital barista Sam is instructed via a system prompt inside server.js to act as an authentic, helpful café team member:
⚬	Tone & Persona: Converses warmly, naturally, and concisely like an experienced coffeehouse head barista. Avoids robotic corporate scripts, markdown checklists, or repetitive conversational loops across turns.
⚬	Roastery Knowledge: Understands the entire store menu, answering customer questions about single-origin roasts (light, medium, dark), extraction methods, cold brews, and alternative milks (oat, almond).
⚬	Intelligent Pairing Suggestions: Dynamically suggests complementary menu items based on customer selections (e.g., offering a warm butter croissant or bacon, gouda & egg sandwich when someone orders a black coffee or espresso).
⚬	Order Finalization: Actively monitors the conversation for closing phrases (such as "no, that is all", "nothing else", "I'm good", or "that's it"), stops suggesting additional items immediately, and outputs a complete itemized receipt ticket containing line items, subtotal, estimated tax, and final total.
