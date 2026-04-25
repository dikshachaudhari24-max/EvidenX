'use client';

import { ProtectedLayout } from '@/components/protected-layout';
import { mockTriggers } from '@/lib/mock-data';
import { ToggleRight, ToggleLeft, Zap, Clock } from 'lucide-react';
import { useState } from 'react';

export default function TriggersPage() {
  const [triggers, setTriggers] = useState(mockTriggers);

  const handleToggle = (id: string) => {
    setTriggers(triggers.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)));
  };

  const typeColors: Record<string, string> = {
    manual: 'bg-slate-500/20 text-slate-400',
    automated: 'bg-blue-500/20 text-blue-400',
    scheduled: 'bg-amber-500/20 text-amber-400',
  };

  return (
    <ProtectedLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Triggers</h1>
          <p className="text-muted-foreground mt-2">Automated and manual triggers for evidence processing</p>
        </div>

        {/* Triggers Grid */}
        <div className="space-y-4">
          {triggers.map((trigger) => (
            <div key={trigger.id} className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{trigger.name}</h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${typeColors[trigger.type]}`}>
                      {trigger.type}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(trigger.id)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {trigger.enabled ? (
                    <ToggleRight className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-slate-500" />
                  )}
                </button>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Condition</h4>
                  <div className="bg-slate-950 rounded p-3 text-xs text-cyan-400 font-mono">
                    <code className="whitespace-pre-wrap break-words">{trigger.condition}</code>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Action</h4>
                  <div className="bg-slate-950 rounded p-3 text-xs text-emerald-400 font-mono">
                    <code className="whitespace-pre-wrap break-words">{trigger.action}</code>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center justify-between pt-4 border-t border-border text-sm">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-muted-foreground text-xs">Status</p>
                    <p className={`font-medium mt-1 ${trigger.enabled ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {trigger.enabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  {trigger.lastFired && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground text-xs">Last Fired</p>
                        <p className="text-foreground mt-1">{trigger.lastFired.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-xs font-medium mb-2">Total Triggers</p>
            <p className="text-3xl font-bold text-foreground">{triggers.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-xs font-medium mb-2">Enabled</p>
            <p className="text-3xl font-bold text-emerald-400">{triggers.filter((t) => t.enabled).length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-xs font-medium mb-2">Disabled</p>
            <p className="text-3xl font-bold text-slate-400">{triggers.filter((t) => !t.enabled).length}</p>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
