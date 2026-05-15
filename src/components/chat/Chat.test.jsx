import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { Chat } from './Chat.jsx'

const mockChatStreaming = vi.fn()

vi.mock('../../assistants/googleAI.js', () => ({
  GoogleAI_Assistant: vi.fn().mockImplementation(function () {
    this.chatStreaming = mockChatStreaming
  }),
}))

vi.mock('../Messages/Messages.jsx', () => ({
  Messages: ({ messages }) => (
    <div data-testid="messages">
      {messages.map((m, i) => (
        <div key={i} data-testid={`message-${m.role}`}>{m.content}</div>
      ))}
    </div>
  ),
}))

vi.mock('../controls/Controls.jsx', () => ({
  Controls: ({ isDisabled, onSend }) => (
    <button data-testid="send-btn" disabled={isDisabled} onClick={() => onSend('hello')}>
      Send
    </button>
  ),
}))

vi.mock('../loader/Loader.jsx', () => ({
  Loader: () => <div data-testid="loader" />,
}))

const defaultProps = {
  chatId: 'test-chat-1',
  chatMessages: [],
  onChatMessagesUpdate: vi.fn(),
  isActive: true,
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Chat', () => {
  it('renders nothing when isActive is false', () => {
    const { container } = render(<Chat {...defaultProps} isActive={false} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders Messages and Controls when isActive is true', () => {
    async function* empty() {}
    mockChatStreaming.mockReturnValue(empty())
    render(<Chat {...defaultProps} />)
    expect(screen.getByTestId('messages')).toBeInTheDocument()
    expect(screen.getByTestId('send-btn')).toBeInTheDocument()
  })

  it('does not show Loader initially', () => {
    async function* empty() {}
    mockChatStreaming.mockReturnValue(empty())
    render(<Chat {...defaultProps} />)
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
  })

  it('shows Loader and disables Controls while waiting for first AI chunk', async () => {
    let resolveStream
    const gate = new Promise((r) => { resolveStream = r })
    async function* hangingStream() { await gate }

    mockChatStreaming.mockReturnValue(hangingStream())
    render(<Chat {...defaultProps} />)
    fireEvent.click(screen.getByTestId('send-btn'))

    await waitFor(() => {
      expect(screen.getByTestId('loader')).toBeInTheDocument()
      expect(screen.getByTestId('send-btn')).toBeDisabled()
    })

    resolveStream()
  })

  it('calls onChatMessagesUpdate with the user message when sending', async () => {
    async function* empty() {}
    mockChatStreaming.mockReturnValue(empty())

    const onUpdate = vi.fn()
    render(<Chat {...defaultProps} onChatMessagesUpdate={onUpdate} />)
    fireEvent.click(screen.getByTestId('send-btn'))

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith(
        'test-chat-1',
        expect.arrayContaining([
          expect.objectContaining({ role: 'user', content: 'hello' }),
        ])
      )
    })
  })

  it('appends streamed chunks to the assistant message', async () => {
    async function* chunkStream() {
      yield 'Hello'
      yield ', world'
    }
    mockChatStreaming.mockReturnValue(chunkStream())

    const onUpdate = vi.fn()
    render(<Chat {...defaultProps} onChatMessagesUpdate={onUpdate} />)
    fireEvent.click(screen.getByTestId('send-btn'))

    await waitFor(() => {
      const calls = onUpdate.mock.calls
      const lastCall = calls[calls.length - 1]
      const assistantMsg = lastCall[1].find((m) => m.role === 'assistant')
      expect(assistantMsg?.content).toBe('Hello, world')
    })
  })

  it('adds a system error message when the AI call throws', async () => {
    mockChatStreaming.mockRejectedValue(new Error('API failure'))

    const onUpdate = vi.fn()
    render(<Chat {...defaultProps} onChatMessagesUpdate={onUpdate} />)
    fireEvent.click(screen.getByTestId('send-btn'))

    await waitFor(() => {
      const calls = onUpdate.mock.calls
      const lastCall = calls[calls.length - 1]
      expect(lastCall[1]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ role: 'system', content: 'API failure' }),
        ])
      )
    })
  })
})
