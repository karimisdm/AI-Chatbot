# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

There are no tests configured in this project.

## Environment Variables

Create `.env.local` with:
```
VITE_GOOGLE_AI_API_KEY=...
VITE_OPEN_AI_API_KEY=...
```

Both are accessed directly from the browser — no backend server exists.

## Architecture

Frontend-only React + Vite SPA. No routing library, no global state library, no backend.

**State flow:** `App.jsx` owns the list of chats and active chat ID. It passes the active chat's messages down to `Chat.jsx`, and receives updates via an `onChatMessagesUpdate` callback. All state lives in React `useState` hooks in `App.jsx`.

**AI providers** live in `src/assistants/`:
- `googleai.js` — primary, uses `@google/generative-ai`, implements streaming via async generator (`chatStreaming()`) with `sendMessageStream()`; model `gemini-3-flash-preview`
- `openai.js` — secondary (currently commented out in `Chat.jsx`), non-streaming, uses the `openai` browser-allowed SDK; model `gpt-5-nano`

Switching providers means swapping the import in `Chat.jsx`. The streaming loop in `Chat.jsx` consumes chunks from the async generator and appends them to the last message in state on each iteration.

**Styling:** CSS Modules throughout (each component has a paired `.module.css`). Global styles and color scheme (light/dark) are in `src/index.css`. Max content width is 960px.

**Key component responsibilities:**
- `Sidebar.jsx` — toggleable chat list, handles Escape key to close
- `Messages.jsx` — renders markdown via `react-markdown`, auto-scrolls to latest message
- `Controls.jsx` — auto-resizing textarea (`react-textarea-autosize`), Enter sends, Shift+Enter inserts newline
- `Loader.jsx` — spinner shown during AI response