import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { createThreadUseCase } from './use-cases/create-thread.use-case';
import { createMessageUseCase } from './use-cases/create-message.use-case';
import { createRunUseCase } from './use-cases/create-run.use-case';
import { runCompleteStatusUseCase } from './use-cases/run-complete-status.use-case';
import { getMessageListUseCase } from './use-cases/get-message-list.use-case';

@Injectable()
export class OpenAiAssitantService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async processNewConversation(prompt: string) {
    const thread = await createThreadUseCase(this.openai);

    await createMessageUseCase(this.openai, {
      threadId: thread.id,
      question: prompt,
    });

    const run = await createRunUseCase(this.openai, { threadId: thread.id });

    await runCompleteStatusUseCase(this.openai, {
      threadId: thread.id,
      runId: run.id,
    });

    const results = await getMessageListUseCase(this.openai, {
      threadId: thread.id,
    });

    const messages = results
      .map((m) => m.content)
      .flat()
      .map((c) => c.text?.value ?? '');

    return {
      threadId: thread.id,
      messages,
    };
  }
}
