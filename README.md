# AI Chatbot

An AI-powered chatbot built with React, integrating Google's Gemini API for real-time conversational responses.

<img width="1266" height="975" alt="image" src="https://github.com/user-attachments/assets/9aedf572-1abf-447f-9f9d-fe9da0e88dfe" />

## Overview

This project explores how to integrate a large language model into a real frontend application, handling streaming responses, managing conversation state, and building a chat interface that feels responsive and natural to use.

## Features

- 💬 Real-time conversational interface powered by the Gemini API
- ⚛️ Built with React using a component-based architecture
- 🔄 Structured state management for conversation history
- ⚡ Fast development experience with Vite
- 🎨 Clean, responsive chat UI

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React |
| Build Tool | Vite |
| AI Integration | Google Gemini API |
| Language | JavaScript |
| Linting | ESLint |

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A Gemini API key ([get one here](https://ai.google.dev/))

### Installation

```bash
git clone https://github.com/karimisdm/AI-Chatbot.git
cd AI-Chatbot
npm install
```

### Set up environment variables

Create a `.env` file in the root directory:

```
VITE_GEMINI_API_KEY=your_api_key_here
```

### Run locally

```bash
npm run dev
```

## What I learned/focused on

- Working with a streaming API and handling async responses in the UI
- Structuring component state for a chat-style interface
- Managing API keys and environment variables securely on the frontend
- Keeping the interface responsive even while waiting on model output
