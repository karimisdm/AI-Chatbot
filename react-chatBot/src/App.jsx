import styles from './App.module.css'
import { Sidebar } from './components/sidebar/Sidebar.jsx';
import {Chat} from './components/chat/Chat.jsx'
import { useMemo, useState } from 'react';
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
  const [activeChatId, setActiveChatId] = useState(chats[0].id);
  const activeChatMessages = useMemo(()=> chats.find(
    (chat) => chat.id === activeChatId)?.messages ?? [],[chats, activeChatId]);
  
  function updateChats(messages){
     setChats((prevChats)=> prevChats.map((chat)=> chat.id === activeChatId? {...chat, messages}: chat))
  };

  function handleChatMessagesUpdate(messages){
    updateChats(messages);  
  }  

  return (
    <div className={styles.App}>
     
      <header className={styles.Header}>
        <img src='./chatbot.png' className={styles.Logo} />
        <h2 className={styles.Title}>AI ChatBot</h2>
      </header>
      <div className={styles.Content}>
        <Sidebar chats={chats} activeChatId={activeChatId} onActiveChatIdChange={setActiveChatId} />
        <main className={styles.Main}>

          <Chat  chatId={activeChatId} chatMessages={activeChatMessages} onChatMessagesUpdate={handleChatMessagesUpdate}/>
          
        </main>
      </div>
    </div>
  )
};

export default App
