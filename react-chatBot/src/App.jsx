import styles from './App.module.css'
import { useState } from 'react';
import { Chat } from './components/chat/Chat.jsx'
import { Controls } from './components/controls/Controls.jsx';
function App() {
  const [messages, setMessages] = useState([])
  
  function handleMessageSend(input){
    setMessages(prevMessages => [...prevMessages, {role:'user', content: input}])

  }
  return (
    <div className={styles.App}>
      <header className={styles.Header}>
        <img src='./public/chatbot.png' className={styles.Logo} />
        <h2 className={styles.Title}>AI ChatBot</h2>
      </header>
      <div className={styles.ChatContainer}>
        <Chat messages={messages}/>
      </div>
      <Controls onSend={handleMessageSend}/>
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
