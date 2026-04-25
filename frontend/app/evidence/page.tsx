'use client';

import { ProtectedLayout } from '@/components/protected-layout';
import { StatusBadge } from '@/components/status-badge';
import { InvestigationNotes } from '@/components/investigation-notes';
import { EditEvidenceModal } from '@/components/edit-evidence-modal';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Search, FileText, Trash2, Edit2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function EvidencePage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [evidenceToEdit, setEvidenceToEdit] = useState<any | null>(null);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [evidence, setEvidence] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const canAddNotes = user?.role === 'investigator' || user?.role === 'admin';

  const loadEvidence = async () => {
    try {
      const data = await api.getEvidence();
      setEvidence(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load evidence:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEvidence(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this evidence?')) return;
    try {
      await api.deleteEvidence(id);
      toast.success('Evidence deleted successfully');
      loadEvidence();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete evidence');
    }
  };

  const filteredEvidence = evidence.filter((ev) => {
    const matchesSearch =
      ev.evidence_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.case_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterStatus || ev.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusCounts: Record<string, number> = {};
  evidence.forEach(e => { statusCounts[e.status] = (statusCounts[e.status] || 0) + 1; });

  return (
    <ProtectedLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Evidence Management</h1>
          <p className="text-muted-foreground mt-2">View and manage all evidence items</p>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by ID, description, or case..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <select
            value={filterStatus || ''}
            onChange={(e) => setFilterStatus(e.target.value || null)}
            className="px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">All Statuses</option>
            <option value="secured">Secured</option>
            <option value="analyzed">Analyzed</option>
            <option value="archived">Archived</option>
            <option value="compromised">Compromised</option>
          </select>
        </div>

        {/* Evidence Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-900/50 border-b border-border">
                  <tr>
                    <th className="text-left py-4 px-6 text-muted-foreground font-medium">ID</th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-medium">Description</th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-medium">Case</th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-medium">Status</th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-medium">Created</th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-medium">Location</th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvidence.length > 0 ? (
                    filteredEvidence.map((ev) => (
                      <tr
                        key={ev.evidence_id}
                        className="border-b border-border hover:bg-slate-900/50 transition-colors"
                      >
                        <td className="py-4 px-6 text-foreground font-mono text-xs truncate max-w-xs">
                          {ev.evidence_id?.substring(0, 8)}...
                        </td>
                        <td className="py-4 px-6 text-foreground">{ev.description}</td>
                        <td className="py-4 px-6 text-foreground">{ev.case_id}</td>
                        <td className="py-4 px-6">
                          <StatusBadge status={ev.status} />
                        </td>
                        <td className="py-4 px-6 text-muted-foreground">
                          {new Date(ev.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-muted-foreground">
                          {ev.location || '—'}
                        </td>
                        <td className="py-4 px-6">
                          <button className="text-accent hover:text-accent/80 transition-colors mr-3">
                            <FileText className="w-4 h-4" />
                          </button>
                          {user?.role === 'admin' && (
                            <button
                              type="button"
                              onClick={() => {
                                setEvidenceToEdit(ev);
                                setIsEditOpen(true);
                              }}
                              className="text-amber-400 hover:text-amber-300 transition-colors mr-3"
                              title="Edit Evidence"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          {canAddNotes && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedEvidenceId(ev.evidence_id);
                                setIsNotesOpen(true);
                              }}
                              className="text-xs px-3 py-1.5 rounded-md border border-zinc-700 text-zinc-200 bg-[#09090B] hover:bg-zinc-900 transition-colors mr-2"
                            >
                              Investigate
                            </button>
                          )}
                          {user?.role === 'admin' && (
                            <button
                              type="button"
                              onClick={() => handleDelete(ev.evidence_id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 px-6 text-center text-muted-foreground">
                        No evidence found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          {['secured', 'analyzed', 'archived', 'compromised'].map((status) => (
            <div key={status} className="bg-card border border-border rounded-lg p-4">
              <p className="text-xs text-muted-foreground capitalize mb-2">{status}</p>
              <p className="text-2xl font-bold text-foreground">
                {statusCounts[status] || 0}
              </p>
            </div>
          ))}
        </div>

        <InvestigationNotes
          open={isNotesOpen}
          onOpenChange={setIsNotesOpen}
          evidenceId={selectedEvidenceId}
          investigatorName={user?.name ?? 'Unknown Investigator'}
        />

        <EditEvidenceModal
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          evidence={evidenceToEdit}
          onSuccess={loadEvidence}
        />
      </div>
    </ProtectedLayout>
  );
}
