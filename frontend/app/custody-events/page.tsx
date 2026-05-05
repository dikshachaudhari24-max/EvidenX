'use client';

import { ProtectedLayout } from '@/components/protected-layout';
import { AddCustodyEventModal } from '@/components/add-custody-event-modal';
import { EditCustodyModal } from '@/components/edit-custody-modal';
import { api } from '@/lib/api';
import { useState, useEffect } from 'react';
import { Loader2, Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const eventTypeColors: Record<string, string> = {
  received: 'bg-blue-500',
  transferred: 'bg-amber-500',
  analyzed: 'bg-emerald-500',
  released: 'bg-slate-500',
  destroyed: 'bg-red-500',
};

export default function CustodyEventsPage() {
  const [evidenceList, setEvidenceList] = useState<any[]>([]);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [custodyChain, setCustodyChain] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chainLoading, setChainLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<any | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this custody event?')) return;
    try {
      await api.deleteCustodyEvent(id);
      toast.success('Custody event deleted');
      loadChain();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete event');
    }
  };

  const loadChain = async (evidenceIdToLoad?: string) => {
    const targetId = evidenceIdToLoad || selectedEvidenceId;
    if (!targetId) return;
    setChainLoading(true);
    try {
      const data = await api.getCustodyChain(targetId);
      setCustodyChain(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load custody chain:', err);
    } finally {
      setChainLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getEvidence();
        const list = Array.isArray(data) ? data : [];
        setEvidenceList(list);
        if (list.length > 0) {
          setSelectedEvidenceId(list[0].evidence_id);
        }
      } catch (err) {
        console.error('Failed to load evidence:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    loadChain();
  }, [selectedEvidenceId]);

  const selectedEvidence = evidenceList.find((e) => e.evidence_id === selectedEvidenceId);

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Custody Events</h1>
          <p className="text-muted-foreground mt-2">Track chain of custody for all evidence items</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Evidence Selection */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Evidence Items</h2>
              <div className="space-y-2">
                {evidenceList.map((ev) => (
                  <button
                    key={ev.evidence_id}
                    onClick={() => setSelectedEvidenceId(ev.evidence_id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedEvidenceId === ev.evidence_id
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-slate-900/50 text-foreground hover:bg-slate-900'
                    }`}
                  >
                    <p className="font-mono text-xs mb-1">{ev.evidence_id?.substring(0, 8)}...</p>
                    <p className="text-sm">{ev.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Chain of Custody</h2>
                  {selectedEvidence && (
                    <p className="text-sm text-muted-foreground mt-2">{selectedEvidence.description}</p>
                  )}
                </div>
                {selectedEvidence && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" /> Log Event
                  </button>
                )}
              </div>

              {chainLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : custodyChain.length > 0 ? (
                <div className="space-y-4">
                  {custodyChain.map((event, idx) => (
                    <div key={event.event_id} className="flex gap-4 group">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${eventTypeColors[event.action_type] || 'bg-slate-500'}`}
                        />
                        {idx < custodyChain.length - 1 && <div className="w-0.5 h-12 bg-slate-700 my-2" />}
                      </div>
                      <div className="pb-4 flex-1 flex justify-between items-start">
                        <div>
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-sm capitalize">{event.action_type}</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(event.event_time).toLocaleString()}
                              </p>
                            </div>
                            <span className="text-xs text-muted-foreground ml-4">{event.actor_badge}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">{event.actor_name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{event.location}</p>
                          {event.notes && <p className="text-xs mt-2 text-slate-400">{event.notes}</p>}
                        </div>
                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                          <button
                            onClick={() => {
                              setEventToEdit(event);
                              setIsEditModalOpen(true);
                            }}
                            className="p-1.5 text-zinc-400 hover:text-amber-400 bg-zinc-800/50 hover:bg-zinc-800 rounded-md transition-colors"
                            title="Edit Event"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(event.event_id)}
                            className="p-1.5 text-zinc-400 hover:text-red-400 bg-zinc-800/50 hover:bg-zinc-800 rounded-md transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  No custody events recorded for this evidence item
                </div>
              )}

              {/* Evidence Details */}
              {selectedEvidence && (
                <div className="mt-8 pt-8 border-t border-border space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Evidence Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">ID</p>
                      <p className="text-foreground font-mono mt-1 text-xs">{selectedEvidence.evidence_id}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Case ID</p>
                      <p className="text-foreground mt-1">{selectedEvidence.case_id}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="text-foreground mt-1">{selectedEvidence.location || '—'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Size</p>
                      <p className="text-foreground mt-1">{((selectedEvidence.size_bytes || 0) / 1024).toFixed(1)} KB</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Latest Hash</p>
                      <p className="text-foreground font-mono text-xs mt-1 break-all">
                        {selectedEvidence.latest_hash || '—'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <AddCustodyEventModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          evidenceId={selectedEvidenceId}
          onSuccess={() => loadChain()}
        />

        <EditCustodyModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          event={eventToEdit}
          onSuccess={() => loadChain()}
        />
      </div>
    </ProtectedLayout>
  );
}
