import styles from './chat.module.css'
import Markdown from 'react-markdown'
import {useEffect, useRef} from 'react'

export function Chat({messages}) {
    const messageEndRef = useRef(null);

    useEffect(()=>{
        messageEndRef.current?.scrollIntoView({behavior: 'smooth'});
    },[messages]);

    const Welcome_Message = {role: 'bot', content: 'Hello! How can I assist you today?'};
    return (
        <div className={styles.Chat}>
            {[Welcome_Message,...messages].map((message, index) => (
                <div key={index} data-role={message.role} className={styles.Message}>
                    {/* {message.role}: */}
                    <Markdown>
                        {message.content}
                    </Markdown>  
                </div>
            ))}
            <div ref={messageEndRef}/>
        </div>
    )

}