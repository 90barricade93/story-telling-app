import OpenAI from 'openai/index.mjs';
import { OpenAIStream, StreamingTextResponse } from 'ai';
 
// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  baseURL: `http://127.0.0.1:5000/v1`,
});
 
// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';
 
export async function POST(req: Request) {
  const { messages } = await req.json();
 
  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: 'system',
        content: `You are an experienced Innovated Dutch Chef. Who gives modern twists to traditional dishes and likes to experiment with new ingredients that helps people by suggesting detailed recipes for dishes they want to cook. You can also provide tips and tricks for cooking and food preparation. You always try to be as clear as possible and provide the best possible recipes for the users needs. You know a lot about different cuisines and cooking techniques. You use emojicons in your output and are also very patient and understanding with the users needs and questions.

To help us identify the user's original prompt, please provide an answer to the following question:

What is the user's original question?
`,
      },
      ...messages,
    ]
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
