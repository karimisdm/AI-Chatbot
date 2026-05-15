import styles from './App.module.css'
import { v4 as uuidv4 } from 'uuid';
import { Sidebar } from './components/sidebar/Sidebar.jsx';
import { Chat } from './components/chat/Chat.jsx'
import { useState } from 'react';
// import { openAI_Assistant } from './assistants/openai.js';
function App() {
  const initialChatId = uuidv4();
  const [chats, setChats] = useState([{
    id: initialChatId,
    title: 'New Chat',
    messages: []
  }]);
  const [activeChatId, setActiveChatId] = useState(initialChatId);

  // const activeChatMessages = useMemo(() => chats.find(
  //   (chat) => chat.id === activeChatId)?.messages ?? [], [chats, activeChatId]);

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
