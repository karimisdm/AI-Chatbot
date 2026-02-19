import styles from './Sidebar.module.css';
import { useState } from 'react';


export function Sidebar({ chats, activeChatId, onChatClickId}) {
    const [isOpen, setIsOpen] = useState(false);

    function handleSidebarToggle(){
      setIsOpen(!isOpen);
 };
   function handleEscapeClick(e){
    if(isOpen &&e.key === 'Escape'){
        setIsOpen(false);
    }
   };
   function handleChatClick(chatId){
     onChatClickId(chatId);
   }

    return (
        <>
            <button className={styles.MenuButton} onClick={handleSidebarToggle} onKeyDown={handleEscapeClick}>
                <MenuIcon />
            </button>
            <div className={styles.Sidebar} data-open={isOpen}>
                <ul className={styles.Chats}>
                    {chats.map(chat =>
                        <li key={chat.id} className={styles.Chat} data-active={chat.id === activeChatId} onClick={()=>{handleChatClick(chat.id)}}>
                            <button className={styles.ChatButton}>
                                <div className={styles.ChatTitle}>
                                    {chat.title}
                                </div>

                            </button>
                        </li>
                    )}
                </ul>
            </div>
            {isOpen && <div className={styles.Overlay} onClick={handleSidebarToggle}/>}
        </>
    )
}

function MenuIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /></svg>
    )
}