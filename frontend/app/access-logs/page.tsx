'use client';

import { ProtectedLayout } from '@/components/protected-layout';
import { api } from '@/lib/api';
import { FileKey2, Plus, Loader2, Edit2, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AccessLogModal } from '@/components/access-log-modal';

export default function AccessLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logToEdit, setLogToEdit] = useState<any | null>(null);

  const loadLogs = async () => {
    try {
      const data = await api.getAccessLogs();
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadLogs(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this access log?')) return;
    try {
      await api.deleteAccessLog(id);
      toast.success('Access log deleted successfully');
      loadLogs();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete access log');
    }
  };

  return (
    <ProtectedLayout>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Access Logs</h1>
            <p className="text-muted-foreground mt-2">View system-wide access logs to evidence versions.</p>
          </div>
          <button onClick={() => { setLogToEdit(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium">
            <Plus className="w-4 h-4" /> Create Log
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
                    <th className="text-left py-3 px-5 font-medium text-muted-foreground">Log ID</th>
                    <th className="text-left py-3 px-5 font-medium text-muted-foreground">Action Type</th>
                    <th className="text-left py-3 px-5 font-medium text-muted-foreground">Evidence Version</th>
                    <th className="text-left py-3 px-5 font-medium text-muted-foreground">Access Time</th>
                    <th className="text-right py-3 px-5 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">No access logs found.</td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.log_id} className="border-b border-border hover:bg-slate-900/40">
                        <td className="py-3 px-5 font-mono text-xs text-zinc-300">
                          {log.log_id.substring(0, 8)}
                        </td>
                        <td className="py-3 px-5">
                          <span className="capitalize text-zinc-200">{log.action_type}</span>
                        </td>
                        <td className="py-3 px-5">
                          <p className="text-zinc-200">{log.evidence_description}</p>
                          <p className="text-xs text-muted-foreground mt-1">v{log.version_number} <span className="font-mono ml-2">{log.version_id.substring(0, 8)}</span></p>
                        </td>
                        <td className="py-3 px-5 text-zinc-400">
                          {new Date(log.access_time).toLocaleString()}
                        </td>
                        <td className="py-3 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => { setLogToEdit(log); setIsModalOpen(true); }}
                              className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(log.log_id)}
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

        <AccessLogModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          log={logToEdit}
          onSuccess={() => loadLogs()}
        />
      </div>
    </ProtectedLayout>
  );
}
