// chatgpt.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import OpenAI from "openai";

@Injectable()
export class ChatgptService {
  private readonly openai = new OpenAI({
    organization: "org-hSGGxDM2Lsfi8QWFq7YlXHNg",
    project: "proj_M16ENzZnjctl1MLuBENY4H9r",
  });
  private readonly openaiApiKey = process.env.OPENAI_API_KEY;

  // Define a method to send requests to OpenAIq
  async sendMessage(prompt: string): Promise<{ message: string, meta: any }> {

    const completion = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful vocabulary assistant for my web app. We will be helping users improve their english vocabulary. I will provide you a list of words the user is trying to improve focusing on, your focus for the words I provide will be: definition, spelling."
        },
        {
          role: "system",
          content: "We are in the testing phase sso if you have any recommendations how we can set better content in the conversation, please let me know."
        },
        {
          role: "system",
          content: "My app supports markdown syntax so you can use it to format your responses."
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return { message: completion.choices[0].message.content, meta: completion }
  }
}
