'use client';

import { CustodyEvent } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

interface CustodyTimelineProps {
  events: CustodyEvent[];
}

const eventTypeColors: Record<string, string> = {
  received: 'bg-blue-500',
  transferred: 'bg-amber-500',
  analyzed: 'bg-emerald-500',
  released: 'bg-slate-500',
  destroyed: 'bg-red-500',
};

export function CustodyTimeline({ events }: CustodyTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="py-6 text-center text-muted-foreground">
        No custody events recorded
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event, idx) => (
        <div key={event.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={`w-3 h-3 rounded-full ${eventTypeColors[event.eventType] || 'bg-slate-500'}`}
            />
            {idx < events.length - 1 && <div className="w-0.5 h-12 bg-slate-700 my-2" />}
          </div>
          <div className="pb-4 flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-sm capitalize">{event.eventType}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {event.timestamp.toLocaleString()}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">{event.actor.badge}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{event.actor.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{event.location}</p>
            {event.notes && <p className="text-xs mt-2 text-slate-400">{event.notes}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
