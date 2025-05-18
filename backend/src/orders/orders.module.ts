import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OpenAiModule } from 'src/openai/openai.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [OpenAiModule],
})
export class OrdersModule {}
