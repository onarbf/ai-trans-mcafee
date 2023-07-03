import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { extractTextFromHTML } from '../../utils/htmlExtraction'
 
// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)
 
// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'
 
const createPrompt = ({prompt, language, htmlType}: {
  prompt: string,
  language: string,
  htmlType: 'ngm' | 'email'
}): string =>{

  if(htmlType === 'ngm'){
    return `return this HTML translated to ${language}. Don't change the HTML, only translate the content: ${prompt}`
  }else if(htmlType === 'email'){
    const content = extractTextFromHTML(prompt);
    console.log('content',content)
    return `Given this text, translate it to ${language} and return it as a JSON file divided by sentences, with the translated version and the original: ${content}`
  }else{
    return prompt
  }
    
}

const extractContentFromHTML = (prompt : string) : string =>{

  return ''
}

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { prompt,language, htmlType} = await req.json()
  console.log(prompt, language, htmlType)
  const finalPrompt = createPrompt({prompt,language, htmlType})
  console.log('Final Prompt:', finalPrompt)
  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo-16k',
    stream: true,
    messages: [
      {"role": "user", "content": finalPrompt},
    ]
  })
  
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
  // Respond with the stream
  return new StreamingTextResponse(stream)
}
