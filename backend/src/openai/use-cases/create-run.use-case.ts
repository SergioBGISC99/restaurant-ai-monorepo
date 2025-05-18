import OpenAI from 'openai';
import { Options } from '../interfaces/options.interface';

export const createRunUseCase = async (openai: OpenAI, options: Options) => {
  const { threadId, assistantId } = options;

  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId!,
  });

  return run;
};
