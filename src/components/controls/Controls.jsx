import { useEffect, useRef, useState } from 'react'
import styles from './Controls.module.css'
import TextareaAutosize from 'react-textarea-autosize';

export function Controls({isDisabled,onSend}){
  const [input, setInput]= useState('');
  const textareaRef = useRef(null);

  useEffect(()=>{
    if(!isDisabled){
      textareaRef.current.focus();
    }

  },[isDisabled])

  function handleInputSend(){
    if(input.trim() === '') return;
    else{
          onSend(input);
          setInput('');
    }  
  };
  function handleEnterPress(e){
    if(e.key === 'Enter' && !e.shiftKey){
      e.preventDefault();
      handleInputSend()
    }
  }
  
  return(
    <div className={styles.Controls}>
        <div className={styles.TextAreaContainer}>
            <TextareaAutosize ref={textareaRef} minRows={1} maxRows={4} className={styles.TextArea} placeholder="Message AI" value={input} onChange={(e)=> setInput(e.target.value)}
               onKeyDown={handleEnterPress} disabled={isDisabled}/>
        </div>
        <button className={styles.Button} onClick={handleInputSend} disabled={isDisabled}><SendIcon/></button>
    </div>
  )

//I built a separate component for the send icon to keep the code clean and use svg format for editing
  function SendIcon(){
    return(
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
            <path d="M89-128v-244l366-108L89-588v-244l831 352L89-128Z"/></svg>
    )
  }
}