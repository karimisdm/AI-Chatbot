import styles from './chat.module.css'
export function Chat({messages}) {
    return (
        <div className={styles.Chat}>
            {messages.map((message, index) => (
                <div key={index} data-role={message.role} className={styles.Message}>
                 {message.role}: {message.content}
                </div>

            ))}
        </div>
    )

}