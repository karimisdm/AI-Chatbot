import {GoogleGenerativeAI} from '@google/generative-ai';

const googleAi = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY);


export class GoogleAI_Assistant {
  
    constructor(model= 'gemini-3-flash-preview'){
       const gemini = googleAi.getGenerativeModel({model});
       this.chat = gemini.startChat({history:[]})
    };

    async chatWithAI(content) {
        try {
            
            const result = await this.chat.sendMessage(content);
            const text = result.response.text();
            return text;
        } catch (error) {
            console.error("Error in chatWithAI:", error); 
            throw error; 
        }
    };
    //using generator for handling streaming responses.
    async *chatStreaming(content){
        try {
            const result = await this.chat.sendMessageStreaming(content);

            for await (const chunk of result){
                yield chunk.response.text();
            }
        } catch (error) {
             console.error("Error in chatStreaming:", error); 
             throw error;        
        }
    }
}