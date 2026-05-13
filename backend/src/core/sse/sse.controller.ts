import { Controller, MessageEvent, Param, Sse } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { SseEventsService } from './sse-events.service';

@Controller('api/resumes')
export class SseController {
  constructor(private readonly sseEventsService: SseEventsService) {}

  @Sse(':candidateId/events')
  stream(@Param('candidateId') candidateId: string): Observable<MessageEvent> {
    return this.sseEventsService.getStream(candidateId).pipe(
      map((event) => ({
        type: event.type,
        data: event,
      })),
    );
  }
}
