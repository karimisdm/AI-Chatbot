import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
    dangerouslyAllowBrowser: true
});

export class openAI_Assistant {
  constructor(model="gpt-5-nano"){
    this.model = model;
  }

  async chatWithAI(content, history){
    try {
        const result = await openai.chat.completions.create({
            model: this.model,
            messages: [...history, {role: 'user', content: content}]
        })
        return result.choices[0].message.content;
        
    } catch (error) {
        console.log('Error in chatWithAI: ', error);
        throw error;
        
    }
  }
}