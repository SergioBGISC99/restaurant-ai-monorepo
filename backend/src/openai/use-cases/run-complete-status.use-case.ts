import OpenAI from 'openai';
import { Options } from '../interfaces/options.interface';

export const runCompleteStatusUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { threadId, runId } = options;

  const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

  if (runStatus.status === 'completed') return runStatus;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return await runCompleteStatusUseCase(openai, options);
};
