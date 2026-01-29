export function Chat({messages}) {
    return (
        <div>
            {messages.map((message, index) => (
                <div key={index} data-role={message.role}>
                 {message.role}: {message.content}
                </div>

            ))}
        </div>
    )

}