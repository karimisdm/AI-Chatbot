import styles from './App.module.css'
import { Sidebar } from './components/sidebar/Sidebar.jsx';
import {Chat} from './components/chat/Chat.jsx'
import { useState } from 'react';
// import { openAI_Assistant } from './assistants/openai.js';

const CHATS = [
    { id: 2, title: "What is React?",
      messages:[
        { role: 'bot', content: 'React is a JavaScript library for building user interfaces.' },
        { role: 'user', content: 'Who developed React?' },
      ]
     },
    { id: 4, title: "Gemini or ChatGPT?", messages: [
        { role: 'user', content: 'Which one is better, Gemini or ChatGPT?' },
        { role: 'bot', content: 'Both Gemini and ChatGPT are powerful language models developed by OpenAI. The choice between them depends on your specific use case and requirements.' }
    ] },
];

function App() {
  const [chats, setChats] = useState(CHATS);
  return (
    <div className={styles.App}>
     
      <header className={styles.Header}>
        <img src='./chatbot.png' className={styles.Logo} />
        <h2 className={styles.Title}>AI ChatBot</h2>
      </header>
      <div className={styles.Content}>
        <Sidebar chats={chats} />
        <main className={styles.Main}>
          <Chat/>
          
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
