import styles from './App.module.css'
import { useState } from 'react';
import { Sidebar } from './components/sidebar/Sidebar.jsx';
import { Chat } from './components/chat/Chat.jsx'
import { Controls } from './components/controls/Controls.jsx';
import { GoogleAI_Assistant } from './assistants/googleai.js';
import { Loader } from './components/loader/Loader.jsx';
// import { openAI_Assistant } from './assistants/openai.js';

function App() {
  const [messages, setMessages] = useState([]);
  const assistant = new GoogleAI_Assistant();
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);  // const assistant = new openAI_Assistant();

  function addMessage(message) {
    setMessages(prevMessages => [...prevMessages, message])
  }

  function updateLastMessageContent(content) {
    setMessages((prevMessages) =>
      prevMessages.map((message, index) =>
        index === prevMessages.length - 1 ? { ...message, content: message.content + content } : message)
    );
  }

  async function handleMessageSend(input) {
    addMessage({ content: input, role: 'user' });
    setIsLoading(true);
    try {
      const result = await assistant.chatStreaming(input);
      let isFirstChunk = false;
      for await (const chunk of result) {
        if (!isFirstChunk) {
          isFirstChunk = true;
          addMessage({ content: '', role: 'bot' });
          setIsLoading(false);
          setIsStreaming(true);
        }
        updateLastMessageContent(chunk);
      }
      setIsStreaming(false);
    } catch (error) {
      addMessage({
        content: "Sorry, there was an error processing your request. Please try again later. Error: " + error.message,
        role: 'System'
      });
      // setIsLoading(false);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }

  }
  return (
    <div className={styles.App}>
      {isLoading && <Loader />}
      <header className={styles.Header}>
        <img src='./chatbot.png' className={styles.Logo} />
        <h2 className={styles.Title}>AI ChatBot</h2>
      </header>
      <div className={styles.Content}>
        <Sidebar />
        <main className={styles.Main}>
          <div className={styles.ChatContainer}>
            <Chat messages={messages} />
          </div>
          <Controls isDisabled={isLoading || isStreaming} onSend={handleMessageSend} />

        </main>
      </div>
    </div>
  )
};

// const initialMessages = [
//   { role: 'bot', content: 'Hello! How can I assist you today?' },
//   { role: 'user', content: 'Can you tell me a joke?' },
// ]

export default App
