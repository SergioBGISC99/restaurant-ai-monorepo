import OpenAI from 'openai';
import { Options } from '../interfaces/options.interface';

export const getMessageListUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { threadId } = options;

  const msgList = await openai.beta.threads.messages.list(threadId);

  const messages = msgList.data.map((msg) => ({
    role: msg.role,
    content: msg.content.map((content) => (content as any).text.value),
  }));

  return messages;
};
