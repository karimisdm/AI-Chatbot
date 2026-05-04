import styles from './App.module.css'
import { v4 as uuidv4 } from 'uuid';
import { Sidebar } from './components/sidebar/Sidebar.jsx';
import { Chat } from './components/chat/Chat.jsx'
import { useMemo, useState } from 'react';
// import { openAI_Assistant } from './assistants/openai.js';

const CHATS = [
  {
    id: 2, title: "What is React?",
    messages: [
      { role: 'bot', content: 'React is a JavaScript library for building user interfaces.' },
      { role: 'user', content: 'Who developed React?' },
    ]
  },
  {
    id: 4, title: "Gemini or ChatGPT?", messages: [
      { role: 'user', content: 'Which one is better, Gemini or ChatGPT?' },
      { role: 'bot', content: 'Both Gemini and ChatGPT are powerful language models developed by OpenAI. The choice between them depends on your specific use case and requirements.' }
    ]
  },
];

function App() {
  const [chats, setChats] = useState(CHATS);
  const [activeChatId, setActiveChatId] = useState(chats[0].id);

  const activeChatMessages = useMemo(() => chats.find(
    (chat) => chat.id === activeChatId)?.messages ?? [], [chats, activeChatId]);

  const hasEmptyChat = chats.some(chat =>
     chat.title === 'New Chat' && chat.messages.length === 0);  

  function handleChatMessagesUpdate(id,messages) {
    const title = messages[0]?.content.split(" ").slice(0,5).join(" ")|| "New Chat";
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === id ? { ...chat, messages, title } : chat))

  }

  function handleNewChatCreate() {
    const id = uuidv4();
    setChats((prevChats) => [...prevChats, {
      id,
      title: 'New Chat',
      messages: []
    }]);
    setActiveChatId(id);

  };


  return (
    <div className={styles.App}>

      <header className={styles.Header}>
        <img src='./chatbot.png' className={styles.Logo} />
        <h2 className={styles.Title}>AI ChatBot</h2>
      </header>
      <div className={styles.Content}>
        <Sidebar chats={chats} activeChatId={activeChatId} onActiveChatIdChange={setActiveChatId} onNewChatCreate={handleNewChatCreate} 
          hasEmptyChat={hasEmptyChat}/>
        <main className={styles.Main}>
          {chats.filter(chat=> chat.id === activeChatId).map((chat)=>(

              <Chat key={chat.id}
                chatId={chat.id}
                isActive={chat.id === activeChatId}
                chatMessages={chat.messages} 
                onChatMessagesUpdate={handleChatMessagesUpdate}
            />
          ))}
        </main>
      </div>
    </div>
  )
};

export default App
