import { useEffect, useState } from 'react';
import type { ScreeningEvent } from '../types/screening';

export function useScreeningEvents(candidateId: string | null) {
  const [events, setEvents] = useState<ScreeningEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!candidateId) {
      return;
    }
    const source = new EventSource(`/api/resumes/${candidateId}/events`);
    source.addEventListener('started', (event) => {
      setEvents((current) => [...current, JSON.parse((event as MessageEvent).data) as ScreeningEvent]);
    });
    source.addEventListener('section', (event) => {
      setEvents((current) => [...current, JSON.parse((event as MessageEvent).data) as ScreeningEvent]);
    });
    source.addEventListener('completed', (event) => {
      setEvents((current) => [...current, JSON.parse((event as MessageEvent).data) as ScreeningEvent]);
    });
    source.addEventListener('failed', (event) => {
      setEvents((current) => [...current, JSON.parse((event as MessageEvent).data) as ScreeningEvent]);
      setError('处理失败');
    });
    source.onerror = () => {
      setError('事件流连接中断');
      source.close();
    };
    return () => source.close();
  }, [candidateId]);

  return { events, error };
}
