import OpenAI from 'openai';
import { Options } from '../interfaces/options.interface';

export const createMessageUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { threadId, question } = options;

  const msg = await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: question ?? '',
  });

  return msg;
};
