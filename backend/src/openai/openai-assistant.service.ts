import { ForbiddenException, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { createThreadUseCase } from './use-cases/create-thread.use-case';
import { createMessageUseCase } from './use-cases/create-message.use-case';
import { createRunUseCase } from './use-cases/create-run.use-case';
import { runCompleteStatusUseCase } from './use-cases/run-complete-status.use-case';
import { getMessageListUseCase } from './use-cases/get-message-list.use-case';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OpenAiAssitantService {
  private openai: OpenAI;

  constructor(private readonly prisma: PrismaService) {
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

  async createOrderFromConversation(input: {
    assistantId: string;
    branchId: string;
    userPhone: string;
    userName: string;
    prompt: string;
  }) {
    const { assistantId, branchId, userPhone, userName, prompt } = input;

    const branch = await this.prisma.branch.findUnique({
      where: { id: branchId },
    });

    if (!branch) throw new ForbiddenException('Sucursal no encontrada');

    const thread = await createThreadUseCase(this.openai);

    await createMessageUseCase(this.openai, {
      threadId: thread.id,
      question: prompt,
    });

    const run = await createRunUseCase(this.openai, {
      threadId: thread.id,
      assistantId,
    });

    await runCompleteStatusUseCase(this.openai, {
      threadId: thread.id,
      runId: run.id,
    });

    const results = await getMessageListUseCase(this.openai, {
      threadId: thread.id,
    });

    const finalMessage = results.at(-1);

    const response =
      finalMessage?.content.map((c: any) => c.text.value).join('\n') ?? '';

    let items: { productId: string; quantity: number }[] = [];

    try {
      items = JSON.parse(response);
      if (!Array.isArray(items)) throw new Error();
    } catch {
      throw new ForbiddenException('La respuesta del asistente no es válida.');
    }

    const order = await this.prisma.order.create({
      data: {
        branchId,
        userPhone,
        userName,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    return {
      order,
      threadId: thread.id,
      messages: results.map((m) => ({
        role: m.role,
        content: m.content.map((c: any) => c.text?.value).join('\n'),
      })),
    };
  }
}
