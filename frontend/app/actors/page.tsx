'use client';

import { ProtectedLayout } from '@/components/protected-layout';
import { ActorModal } from '@/components/actor-modal';
import { api } from '@/lib/api';
import { Shield, Mail, Building2, Loader2, Plus, Edit2, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const roleColors: Record<string, { bg: string; text: string }> = {
  investigator: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  analyst: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  custodian: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  admin: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
};

export default function ActorsPage() {
  const [actors, setActors] = useState<any[]>([]);
  const [custodyEvents, setCustodyEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actorToEdit, setActorToEdit] = useState<any | null>(null);

  const loadData = async () => {
    try {
      const [actorsData, eventsData] = await Promise.all([
        api.getActors(),
        api.getCustodyEvents(),
      ]);
      setActors(Array.isArray(actorsData) ? actorsData : []);
      setCustodyEvents(Array.isArray(eventsData) ? eventsData : []);
    } catch (err) {
      console.error('Failed to load actors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this personnel?')) return;
    try {
      await api.deleteActor(id);
      toast.success('Personnel deleted successfully');
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete personnel');
    }
  };

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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Personnel Management</h1>
            <p className="text-muted-foreground mt-2">View and manage system actors and their permissions</p>
          </div>
          <button
            onClick={() => {
              setActorToEdit(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add Personnel
          </button>
        </div>

        {/* Actors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {actors.map((actor) => {
            const roleConfig = roleColors[actor.role] || { bg: 'bg-slate-500/20', text: 'text-slate-400' };

            return (
              <div key={actor.actor_id} className="bg-card border border-border rounded-lg p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{actor.name}</h3>
                    <span className={`inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${roleConfig.bg} ${roleConfig.text}`}>
                      {actor.role}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setActorToEdit(actor);
                        setIsModalOpen(true);
                      }}
                      className="text-amber-400 hover:text-amber-300 transition-colors"
                      title="Edit Personnel"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(actor.actor_id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      title="Delete Personnel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-muted-foreground text-xs">Department</p>
                      <p className="text-foreground">{actor.department || '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-muted-foreground text-xs">Email</p>
                      <p className="text-foreground text-xs break-all">{actor.email || '—'}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <p className="text-muted-foreground text-xs">Badge ID</p>
                    <p className="text-foreground font-mono mt-1">{actor.badge || '—'}</p>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <p className="text-muted-foreground text-xs">Events Logged</p>
                    <p className="text-2xl font-bold text-accent mt-1">{actor.event_count || 0}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Activity Table */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Recent Activity</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Actor</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Event Type</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Evidence</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Timestamp</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Location</th>
                </tr>
              </thead>
              <tbody>
                {custodyEvents.slice(0, 10).map((event) => {
                  const roleConfig = roleColors[event.actor_role] || { bg: 'bg-slate-500/20', text: 'text-slate-400' };
                  return (
                    <tr key={event.event_id} className="border-b border-border hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4 text-foreground font-medium">{event.actor_name}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${roleConfig.bg} ${roleConfig.text}`}>
                          {event.actor_role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-foreground capitalize">{event.action_type}</td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">{event.evidence_description}</td>
                      <td className="py-3 px-4 text-muted-foreground">{new Date(event.event_time).toLocaleString()}</td>
                      <td className="py-3 px-4 text-muted-foreground">{event.location}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <ActorModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          actor={actorToEdit}
          onSuccess={loadData}
        />
      </div>
    </ProtectedLayout>
  );
}
