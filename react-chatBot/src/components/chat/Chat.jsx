import {useState} from 'react'
import { Messages } from '../Messages/Messages.jsx'
import { Controls } from '../controls/Controls.jsx';
import { Loader } from '../loader/Loader.jsx';
import { GoogleAI_Assistant } from '../../assistants/googleAI.js';
import styles from './Chat.module.css'


export function Chat() {

  const [messages, setMessages] = useState([]);
  const assistant = new GoogleAI_Assistant();
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);  // const assistant = new openAI_Assistant();
  // const [activeChatId, setActiveChatId] = useState(1);

  // const activeChatMessages = useMemo(()=> chats.find(chat => chat.id === activeChatId)?.messages || [], [chats, activeChatId]);

  function addMessage(message) {
    setMessages(prevMessages => [...prevMessages, message])
  }

  function updateLastMessageContent(content) {
    setMessages((prevMessages) =>
      prevMessages.map((message, index) =>
        index === prevMessages.length - 1 ? { ...message, content: message.content + content } : message)
    );
  }

  async function handleMessageSend(input) {
    addMessage({ content: input, role: 'user' });
    setIsLoading(true);
    try {
      const result = await assistant.chatStreaming(input);
      let isFirstChunk = false;
      for await (const chunk of result) {
        if (!isFirstChunk) {
          isFirstChunk = true;
          addMessage({ content: '', role: 'bot' });
          setIsLoading(false);
          setIsStreaming(true);
        }
        updateLastMessageContent(chunk);
      }
      setIsStreaming(false);
    } catch (error) {
      addMessage({
        content: "Sorry, there was an error processing your request. Please try again later. Error: " + error.message,
        role: 'System'
      });
      // setIsLoading(false);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }

  }

    return (
        <>
           {isLoading && <Loader />}

           <div className={styles.Chat}>
            <Messages messages={messages} />
           </div>

           <Controls isDisabled={isLoading || isStreaming} onSend={handleMessageSend} />

        </>
    )
    
}