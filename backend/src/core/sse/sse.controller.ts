import { Controller, MessageEvent, Param, Sse } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { SseEventsService } from './sse-events.service';

@Controller('api/recruitment/submissions')
export class SseController {
  constructor(private readonly sseEventsService: SseEventsService) {}

  @Sse(':applicationId/events')
  stream(
    @Param('applicationId') applicationId: string,
  ): Observable<MessageEvent> {
    return this.sseEventsService.getStream(applicationId).pipe(
      map((event) => ({
        type: event.type,
        data: event,
      })),
    );
  }
}
