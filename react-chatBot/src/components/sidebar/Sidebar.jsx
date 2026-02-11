import styles from './Sidebar.module.css';

const CHATS = [
    {id:1, title: "How to use AI"},
    {id:2, title:"What is React?"},
    {id:3, title:"What is JavaScript?"},
    {id:4, title:"Gemini or ChatGPT?"},
]



export function Sidebar({chats=CHATS, activeChatId = 1}){
    return(
        <div className={styles.Sidebar}>
            <ul>
                {chats.map(chat=>
                    <li key={chat.id}>{chat.title}</li>
                )}
            </ul>
        </div>
    )
}