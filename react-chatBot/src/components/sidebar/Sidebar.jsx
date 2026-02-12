import styles from './Sidebar.module.css';
import { useState } from 'react';
const CHATS = [
    { id: 1, title: "How to use AI" },
    { id: 2, title: "What is React?" },
    { id: 3, title: "What is JavaScript?" },
    { id: 4, title: "Gemini or ChatGPT?" },
];

export function Sidebar({ chats = CHATS, activeChatId = 1 }) {
    const [isOpen, setIsOpen] = useState(false);

    function handleSidebarToggle(){
      setIsOpen(!isOpen);
 };
   function handleEscapeClick(e){
    if(isOpen &&e.key === 'Escape'){
        setIsOpen(false);
    }
   }



    return (
        <>
            <button className={styles.MenuButton} onClick={handleSidebarToggle} onKeyDown={handleEscapeClick}>
                <MenuIcon />
            </button>
            <div className={styles.Sidebar} data-open={isOpen}>
                <ul className={styles.Chats}>
                    {chats.map(chat =>
                        <li key={chat.id} className={styles.Chat} data-active={chat.id === activeChatId}>
                            <button className={styles.ChatButton}>
                                <div className={styles.ChatTitle}>
                                    {chat.title}
                                </div>

                            </button>
                        </li>
                    )}
                </ul>
            </div>
        </>
    )
}

function MenuIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /></svg>
    )
}