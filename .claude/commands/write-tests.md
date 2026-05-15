# Write Tests

Write Vitest unit tests for the component or file specified by the user: $ARGUMENTS

## Project test stack

- **Runner:** Vitest (`npm test` → `vitest run`)
- **DOM:** `happy-dom`
- **Assertions:** `@testing-library/react` + `@testing-library/jest-dom`
- **Setup file:** `src/test-setup.js` (imports jest-dom matchers)
- **Config:** `vite.config.js` → `test: { environment: 'happy-dom', globals: true, setupFiles: './src/test-setup.js' }`

## Test file placement

Co-locate tests next to the source file:
- `src/components/chat/Chat.jsx` → `src/components/chat/Chat.test.jsx`
- `src/assistants/googleai.js` → `src/assistants/googleai.test.js`

## Key mocking patterns

### GoogleAI_Assistant (class, used with `new`)

Use a shared `mockChatStreaming` fn so each test can configure the stream independently:

```js
const mockChatStreaming = vi.fn()

vi.mock('../../assistants/googleAI.js', () => ({
  GoogleAI_Assistant: vi.fn().mockImplementation(function () {
    this.chatStreaming = mockChatStreaming
  }),
}))
```

Never use an arrow function in `mockImplementation` for classes — arrow functions are not constructors.

### Child components

Stub child components with minimal test-friendly markup (data-testid attributes):

```js
vi.mock('../controls/Controls.jsx', () => ({
  Controls: ({ isDisabled, onSend }) => (
    <button data-testid="send-btn" disabled={isDisabled} onClick={() => onSend('test input')}>
      Send
    </button>
  ),
}))
```

### Async generator streams

```js
async function* emptyStream() {}
async function* chunkStream() { yield 'chunk1'; yield 'chunk2' }

// hanging stream (for testing loading state):
let resolveStream
const gate = new Promise((r) => { resolveStream = r })
async function* hangingStream() { await gate }
```

## What tests to write

For each component, cover:

1. **Conditional render** — does it return null / nothing when inactive?
2. **Default render** — does it mount the expected child elements?
3. **User interaction** — fire events via `fireEvent` or `userEvent`, assert state changes
4. **Async/streaming behavior** — loading state shown, chunks appended, stream completes
5. **Error paths** — does it handle thrown errors gracefully (e.g. system message injected)?
6. **Callback contracts** — are parent callbacks (`onChatMessagesUpdate`, `onSend`, etc.) called with the right arguments?

## Message shape

```ts
{ role: 'user' | 'assistant' | 'system' | 'bot', content: string }
```

## Boilerplate to start every test file

```jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { ComponentName } from './ComponentName.jsx'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('ComponentName', () => {
  // tests here
})
```

## After writing tests

Run `npm test` to confirm all tests pass before reporting done.
