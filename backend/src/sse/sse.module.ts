import { Module } from '@nestjs/common';
import { SseController } from './sse.controller';
import { SseEventsService } from './sse-events.service';

@Module({
  controllers: [SseController],
  providers: [SseEventsService],
  exports: [SseEventsService],
})
export class SseModule {}
