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

  // Define a method to send requests to OpenAI
  async sendMessage(prompt: string, context?: any[]): Promise<{ message: string, meta: any }> {
    context.push({
      role: "user",
      content: prompt,
    });

    const completion = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: context,
    });

    return { message: completion.choices[0].message.content, meta: completion }
  }
}
