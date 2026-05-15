# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Summary


## Commands

```bash
npm run dev       # Start Vite dev server (HMR)
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

No tests are configured in this project.

## Environment Variables

Create `.env.local` in the project root:
```
VITE_GOOGLE_AI_API_KEY=...
VITE_OPEN_AI_API_KEY=...
```

Both keys are exposed to the browser via `import.meta.env.VITE_*`. There is no backend.

---

## Architecture

Frontend-only React 19 + Vite 7 SPA. No routing, no global state library (no Redux / Zustand / Context), no backend.

### Component Tree

```
App.jsx                        ← owns all state
  ├── Sidebar.jsx              ← chat list, new-chat button, mobile overlay
  └── Chat.jsx  (×N, one per chat, only active chat rendered)
        ├── Loader.jsx         ← full-screen spinner while awaiting first AI chunk
        ├── Messages.jsx       ← renders grouped messages as Markdown
        └── Controls.jsx       ← auto-resize textarea + send button
```

### State & Data Flow

**App.jsx** is the single source of truth:

| State | Type | Description |
|---|---|---|
| `chats` | `{ id, title, messages[] }[]` | All chat sessions |
| `activeChatId` | `string` | Which chat is displayed |

**Callbacks passed downward:**

- `onChatMessagesUpdate(id, messages)` → received by Chat.jsx; App derives title from `messages[0].content` (first 5 words).
- `onNewChatCreate()` → generates UUID, appends empty chat, switches activeChatId.
- `onActiveChatIdChange(id)` → passed directly as `setActiveChatId`.

**Guard:** `hasEmptyChat = chats.some(c => c.title === 'New Chat' && c.messages.length === 0)` — disables the New Chat button when an unused chat exists.

**Chat.jsx internal state:**

| State | Type | Description |
|---|---|---|
| `messages` | `Message[]` | Local copy of this chat's messages |
| `isLoading` | `boolean` | True until first streaming chunk arrives |
| `isStreaming` | `boolean` | True while generator is yielding chunks |

**Streaming loop** in `handleMessageSend`:
1. Push user message → call `onChatMessagesUpdate`.
2. Call `assistant.chatStreaming(input)` (async generator).
3. First chunk → create empty assistant message, set `isLoading=false`, `isStreaming=true`.
4. Each subsequent chunk → `updateLastMessageContent(chunk)` appends to the last message.
5. Finally → `isStreaming=false`.

---

## Components

### App.jsx
Root component. Owns `chats` and `activeChatId`. Renders Sidebar + one Chat per active chat (filtered).

### Sidebar.jsx

| Prop | Type | Description |
|---|---|---|
| `chats` | `{ id, title, messages[] }[]` | Full chat list to display |
| `activeChatId` | `string` | Highlights the selected chat |
| `onActiveChatIdChange` | `(id) => void` | Switch active chat |
| `onNewChatCreate` | `() => void` | Create new empty chat |
| `hasEmptyChat` | `boolean` | Disables New Chat button when true |

Internal state: `isOpen` (boolean) for mobile slide-in. Closes on Escape key.

### Chat.jsx

| Prop | Type | Description |
|---|---|---|
| `chatId` | `string` | UUID for this chat session |
| `chatMessages` | `Message[]` | Initial messages array |
| `onChatMessagesUpdate` | `(id, msgs) => void` | Propagates updates to App |
| `isActive` | `boolean` | Whether this chat is visible |

Instantiates the AI assistant once on mount. Currently uses `GoogleAI_Assistant`. To switch to OpenAI, change the import and replace `new GoogleAI_Assistant()` with `new openAI_Assistant()`, then replace `chatStreaming` with `chatWithAI` (OpenAI is non-streaming).

### Messages.jsx

| Prop | Type | Description |
|---|---|---|
| `messages` | `Message[]` | Array of `{ role, content }` objects |

Uses `useMemo` to group messages: consecutive assistant/system messages after a user message are placed in one group. Uses `useEffect` + `scrollIntoView` to auto-scroll when the latest message is from the user. Renders content with `react-markdown`.

Prepends a static welcome group: `{ role: 'bot', content: 'Hello! How can I assist you today?' }`.

### Controls.jsx

| Prop | Type | Description |
|---|---|---|
| `isDisabled` | `boolean` | Disables textarea + button during AI response |
| `onSend` | `(input: string) => void` | Called when user submits |

Enter sends; Shift+Enter inserts a newline. Uses `react-textarea-autosize` (minRows=1, maxRows=4). Auto-focuses textarea when `isDisabled` becomes false.

### Loader.jsx
No props. Renders a fixed full-screen overlay with a CSS-animated three-dot spinner.

---

## AI Providers (`src/assistants/`)

### googleai.js — `GoogleAI_Assistant` (active)
```js
constructor(model = 'gemini-3-flash-preview')
async chatWithAI(content)         // non-streaming, returns string
async *chatStreaming(content)      // async generator, yields string chunks
```
Uses `@google/generative-ai`. Maintains conversation history internally via `startChat({ history: [] })`. The same `this.chat` object persists across turns — do not create a new instance per message.

### openai.js — `openAI_Assistant` (inactive, commented out in Chat.jsx)
```js
constructor(model = 'gpt-5-nano')
async chatWithAI(content, history) // non-streaming, returns string
```
Uses `openai` SDK with `dangerouslyAllowBrowser: true`. Does **not** implement `chatStreaming`. To activate: uncomment the import in Chat.jsx and replace the streaming loop with a single `await assistant.chatWithAI()` call.

---

## Styling

CSS Modules throughout — each component has a paired `.module.css`. Import as `styles` and apply via `className={styles.ClassName}`.

**Global styles** (`src/index.css`):
- Body: `max-width: 960px`, centered, full viewport height.
- Font: system-ui stack, antialiased.
- Box-sizing: border-box globally.

**Light/dark mode:** Uses CSS `light-dark()` function — no JS toggle needed. Automatically follows the OS color scheme.

**CSS color values in use:**
- Text: `#0d0d0d` (light), system default (dark)
- Background: `#f3f3f3` (light), `#171717` (dark)
- Sidebar width: `260px` (hardcoded in App.module.css header padding)

**Responsive breakpoints:**
- `≤ 760px`: Header left-padding removed.
- `≤ 768px`: Sidebar becomes a fixed slide-in drawer; hamburger menu button appears; overlay shown when sidebar is open.

**Message styling:**
- User messages: `align-self: flex-end`, gray background.
- Assistant/system messages: left-aligned, no background.
- Code blocks in Markdown: padded, rounded, dark-mode-aware background.

---

## Message Shape

```ts
type Message = {
  role: 'user' | 'assistant' | 'system' | 'bot';
  content: string;
}
```

`'bot'` is only used for the static welcome message in `Messages.jsx`. `'system'` is used for error messages injected when the AI call fails.

---
## Key Patterns

- **No memoization of callbacks in App.jsx** — functions are recreated on each render (simple learning project, intentional).
- **Title derivation:** `messages[0]?.content.split(" ").slice(0, 5).join(" ") || "New Chat"` — first 5 words of the first user message.
- **Unique IDs:** All chat IDs use `uuidv4()` from the `uuid` package.
- **Error handling:** Caught in the streaming try/catch in `handleMessageSend`; injects a `{ role: 'system', content: error.message }` message.
