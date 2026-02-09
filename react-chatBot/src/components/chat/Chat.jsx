import styles from './chat.module.css'
import Markdown from 'react-markdown'
import { useEffect, useMemo, useRef } from 'react'

export function Chat({ messages }) {
    const messageEndRef = useRef(null);
    const messagesGroups = useMemo(() => {
        const groups = [];
        let current = [];
        for (const message of messages) {
            if (message.role === 'user') {
                if (current.length) groups.push(current);
                current = [message];
            } else {
                current.push(message);
            }
        }
        if (current.length) groups.push(current);
        return groups;
    }, [messages]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const Welcome_Message_Group = [
        {
            role: 'bot',
            content: 'Hello! How can I assist you today?'
        }
    ]
    return (
        <div className={styles.Chat}>
            {[Welcome_Message_Group, ...messagesGroups].map((messages, groupIndex) => (
                <div key={groupIndex} className={styles.Group}>
                    {messages.map((message, index) => (
                        <div key={index} data-role={message.role} className={styles.Message}>
                            <Markdown>{message.content}</Markdown>
                        </div>
                    ))}
                </div>
            ))}

            <div ref={messageEndRef} />
        </div>
    )

}