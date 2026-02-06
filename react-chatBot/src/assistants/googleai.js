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
            return result.response.text();
        } catch (error) {
            console.error("Error in chatWithAI:", error); 
            throw error; 
        }
    }
}