'use client';

import { ProtectedLayout } from '@/components/protected-layout';
import { api } from '@/lib/api';
import { FileStack, Plus, Loader2, Edit2, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { VersionModal } from '@/components/version-modal';

export default function VersionsPage() {
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [versionToEdit, setVersionToEdit] = useState<any | null>(null);

  const loadVersions = async () => {
    try {
      const data = await api.getAllVersions();
      setVersions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load versions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadVersions(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this version?')) return;
    try {
      await api.deleteVersion(id);
      toast.success('Version deleted successfully');
      loadVersions();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete version');
    }
  };

  return (
    <ProtectedLayout>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Evidence Versions</h1>
            <p className="text-muted-foreground mt-2">Manage all version snapshots and investigation notes.</p>
          </div>
          <button onClick={() => { setVersionToEdit(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium">
            <Plus className="w-4 h-4" /> Create Version
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900/70 border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-5 font-medium text-muted-foreground">Version ID</th>
                    <th className="text-left py-3 px-5 font-medium text-muted-foreground">Evidence Details</th>
                    <th className="text-left py-3 px-5 font-medium text-muted-foreground">Version #</th>
                    <th className="text-left py-3 px-5 font-medium text-muted-foreground">Notes</th>
                    <th className="text-left py-3 px-5 font-medium text-muted-foreground">Created At</th>
                    <th className="text-right py-3 px-5 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {versions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">No versions found.</td>
                    </tr>
                  ) : (
                    versions.map((version) => (
                      <tr key={version.version_id} className="border-b border-border hover:bg-slate-900/40">
                        <td className="py-3 px-5 font-mono text-xs text-zinc-300">
                          {version.version_id.substring(0, 8)}
                        </td>
                        <td className="py-3 px-5">
                          <p className="text-zinc-200">{version.evidence_description}</p>
                          <p className="text-xs text-muted-foreground font-mono mt-1">{version.evidence_id.substring(0, 8)}</p>
                        </td>
                        <td className="py-3 px-5">
                          <span className="inline-flex items-center justify-center bg-blue-500/20 text-blue-400 font-mono text-xs px-2 py-1 rounded">
                            v{version.version_number}
                          </span>
                        </td>
                        <td className="py-3 px-5 max-w-xs truncate text-zinc-400">
                          {version.notes || <span className="italic opacity-50">No notes</span>}
                        </td>
                        <td className="py-3 px-5 text-zinc-400">
                          {new Date(version.version_time).toLocaleString()}
                        </td>
                        <td className="py-3 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => { setVersionToEdit(version); setIsModalOpen(true); }}
                              className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(version.version_id)}
                              className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <VersionModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          version={versionToEdit}
          onSuccess={() => loadVersions()}
        />
      </div>
    </ProtectedLayout>
  );
}
