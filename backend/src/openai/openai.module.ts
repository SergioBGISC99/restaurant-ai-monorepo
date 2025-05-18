import { Module } from '@nestjs/common';
import { OpenAiAssitantService } from './openai-assistant.service';

@Module({
  providers: [OpenAiAssitantService],
  exports: [OpenAiAssitantService],
})
export class OpenAiModule {}
