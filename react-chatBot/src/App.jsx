import styles from './App.module.css'
import { useState } from 'react';
import { Chat } from './components/chat/Chat.jsx'
import { Controls } from './components/controls/Controls.jsx';
import { GoogleAI_Assistant } from './assistants/googleai.js';
import { Loader } from './components/loader/Loader.jsx';
// import { openAI_Assistant } from './assistants/openai.js';

function App() {
  const [messages, setMessages] = useState([]);
  const assistant = new GoogleAI_Assistant();
  const [isLoading, setIsLoading] = useState(false);
  // const assistant = new openAI_Assistant();

  function addMessage(message) {
    setMessages(prevMessages => [...prevMessages, message])
  }

  function updateLastMessageContent(content){
    setMessages((prevMessages)=>
     prevMessages.map((message, index)=>
       index === prevMessages.length - 1 ? {...message, content: message.content + content} : message)
  );
  }

  async function handleMessageSend(input) {
    addMessage({ content: input, role: 'user' });
    setIsLoading(true);
    try {
      const result = await assistant.chatStreaming(input);
      let isFirstChunk = false;
      for await (const chunk of result){
        if(!isFirstChunk){
          isFirstChunk = true;
          addMessage({content:'', role:'bot'});
          setIsLoading(false);
        }
        updateLastMessageContent(chunk);
      } 
    } catch (error) {
      addMessage({
        content: "Sorry, there was an error processing your request. Please try again later. Error: " + error.message,
        role: 'System'
      });
      // setIsLoading(false);
    }finally{
      setIsLoading(false);
    }

  }
  return (
    <div className={styles.App}>
      {isLoading && <Loader/>}
      <header className={styles.Header}>
        <img src='./chatbot.png' className={styles.Logo} />
        <h2 className={styles.Title}>AI ChatBot</h2>
      </header>
      <div className={styles.ChatContainer}>
        <Chat messages={messages} />
      </div>
      <Controls isDisabled={isLoading} onSend={handleMessageSend} />
    </div>
  )
};

// const initialMessages = [
//   { role: 'bot', content: 'Hello! How can I assist you today?' },
//   { role: 'user', content: 'Can you tell me a joke?' },
//   { role: 'bot', content: 'Why did the scarecrow win an award? Because he was outstanding in his field!' },
//   { role: 'user', content: 'Haha, that was a good one! Thanks!'},
//   { role: 'bot', content: 'You\'re welcome! If you have any more questions or need assistance, feel free to ask.' },
//   { role: 'user', content: 'What is the capital of France?' },
//   { role: 'bot', content: 'The capital of France is Paris.' }
// ]

export default App
