import {Controller, Post, Body, Get} from '@nestjs/common';
import { ChatgptService } from './chatgpt.service';

@Controller('chatgpt')
export class ChatgptController {
  constructor(
    private readonly chatgptService: ChatgptService
  ) {}

  @Get()
  async getHello() {
    return 'Hello from chatgpt!';
  }
  @Post('/message')
  async sendMessage(@Body('answer') answer: string) {
    const response = await this.chatgptService.sendMessage(answer);
    return { message: response.message, meta: response.meta };
  }
}