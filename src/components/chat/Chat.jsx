import { useState } from 'react'
import { Messages } from '../Messages/Messages.jsx'
import { Controls } from '../controls/Controls.jsx';
import { Loader } from '../loader/Loader.jsx';
import { GoogleAI_Assistant } from '../../assistants/googleAI.js';
import styles from './Chat.module.css'


export function Chat({ chatMessages, onChatMessagesUpdate, chatId, isActive=false }) {

  const [messages, setMessages] = useState(chatMessages);
  const assistant = new GoogleAI_Assistant();
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);  // const assistant = new openAI_Assistant();

  function addMessage(message) {
    setMessages((prevMessages) => {
      const nextMessages = [...prevMessages, message];
      onChatMessagesUpdate(chatId, nextMessages);
      return nextMessages;
    });
  }

  function updateLastMessageContent(content) {
    setMessages((prevMessages) => {
      const nextMessages = prevMessages.map((message, index) =>
        index === prevMessages.length - 1 ? { ...message, content: message.content + content } : message
      );
      onChatMessagesUpdate(chatId, nextMessages);
      return nextMessages;
    });
  }

  async function handleMessageSend(input) {
    const userMessage = { role: "user", content: input };
    addMessage(userMessage);
    setIsLoading(true);
    try {
      const result = await assistant.chatStreaming(
        input,
        [...messages.filter(({ role }) => role !== "system"), userMessage]
      );

      let isFirstChunk = false;
      for await (const chunk of result) {
        if (!isFirstChunk) {
          isFirstChunk = true;
          addMessage({ content: "", role: "assistant" });
          setIsLoading(false);
          setIsStreaming(true);
        }

        updateLastMessageContent(chunk);
      }

      setIsStreaming(false);
    } catch (error) {
      addMessage({
        content:
          error?.message ??
          "Sorry, I couldn't process your request. Please try again!",
        role: "system",
      });
      setIsLoading(false);
      setIsStreaming(false);
    }
  }

  if (!isActive) return null;
  return (
    <>
      {isLoading && <Loader />}

      <div className={styles.Chat}>
        <Messages messages={messages} />
      </div>

      <Controls isDisabled={isLoading || isStreaming} onSend={handleMessageSend} />

    </>
  )

}