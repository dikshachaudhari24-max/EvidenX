'use client';

import { ProtectedLayout } from '@/components/protected-layout';
import { api } from '@/lib/api';
import { AlertCircle, AlertTriangle, Info, CheckCircle, Loader2, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function IntegrityAuditPage() {
  const [audits, setAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterResult, setFilterResult] = useState<string | null>(null);
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchResults, setBatchResults] = useState<any>(null);

  const loadAudits = async () => {
    try {
      const data = await api.getAudits();
      const list = Array.isArray(data) ? data : [];
      setAudits(list);
      if (list.length > 0 && !expandedId) setExpandedId(list[0].audit_id);
    } catch (err) { console.error('Failed to load audits:', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadAudits(); }, []);

  const handleBatchAudit = async () => {
    setBatchRunning(true);
    try {
      const result = await api.batchAudit();
      setBatchResults(result);
      toast.success(`Batch audit: ${result.pass_count} PASS, ${result.fail_count} FAIL`);
      loadAudits();
    } catch (err: any) { toast.error(err.message || 'Batch audit failed'); }
    finally { setBatchRunning(false); }
  };

  const filtered = filterResult ? audits.filter((a) => a.result === filterResult) : audits;
  const stats = { total: audits.length, pass: audits.filter((a) => a.result === 'PASS').length, fail: audits.filter((a) => a.result === 'FAIL').length };

  return (
    <ProtectedLayout>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Integrity Audit</h1>
            <p className="text-muted-foreground mt-2">System health and data integrity monitoring</p>
          </div>
          <button onClick={handleBatchAudit} disabled={batchRunning}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors text-sm font-medium">
            {batchRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            Run Batch Audit
          </button>
        </div>

        {batchResults && (
          <div className="mb-6 bg-card border border-border rounded-lg p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Batch Results</h3>
            <div className="grid grid-cols-3 gap-4">
              <div><p className="text-xs text-muted-foreground">Total</p><p className="text-2xl font-bold text-foreground">{batchResults.total}</p></div>
              <div><p className="text-xs text-emerald-400">Passed</p><p className="text-2xl font-bold text-emerald-400">{batchResults.pass_count}</p></div>
              <div><p className="text-xs text-red-400">Failed</p><p className="text-2xl font-bold text-red-400">{batchResults.fail_count}</p></div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-8">
          <button onClick={() => setFilterResult(null)} className={`p-6 rounded-lg border transition-colors ${filterResult === null ? 'bg-accent text-accent-foreground border-accent' : 'bg-card border-border hover:border-accent'}`}>
            <p className="text-xs font-medium mb-2">Total</p><p className="text-3xl font-bold">{stats.total}</p>
          </button>
          <button onClick={() => setFilterResult('PASS')} className={`p-6 rounded-lg border transition-colors ${filterResult === 'PASS' ? 'bg-emerald-500/30 border-emerald-400' : 'bg-card border-border hover:border-emerald-400'}`}>
            <p className="text-xs font-medium text-emerald-400 mb-2">PASS</p><p className="text-3xl font-bold text-emerald-400">{stats.pass}</p>
          </button>
          <button onClick={() => setFilterResult('FAIL')} className={`p-6 rounded-lg border transition-colors ${filterResult === 'FAIL' ? 'bg-red-500/30 border-red-400' : 'bg-card border-border hover:border-red-400'}`}>
            <p className="text-xs font-medium text-red-400 mb-2">FAIL</p><p className="text-3xl font-bold text-red-400">{stats.fail}</p>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="space-y-4">
            {filtered.map((audit) => {
              const isPass = audit.result === 'PASS';
              const isExpanded = expandedId === audit.audit_id;
              return (
                <div key={audit.audit_id} className="bg-card border border-border rounded-lg overflow-hidden">
                  <button onClick={() => setExpandedId(isExpanded ? null : audit.audit_id)} className="w-full p-6 hover:bg-slate-900/50 transition-colors text-left">
                    <div className="flex items-start gap-4">
                      {isPass ? <CheckCircle className="w-5 h-5 mt-1 text-emerald-400" /> : <AlertCircle className="w-5 h-5 mt-1 text-red-400" />}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">{audit.evidence_description || 'Audit'}</h3>
                        <p className="text-sm text-muted-foreground mt-1">Version #{audit.version_number}</p>
                        <p className="text-xs text-muted-foreground mt-2">{new Date(audit.audit_time).toLocaleString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${isPass ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{audit.result}</span>
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-6 py-4 border-t border-border bg-slate-950/50 space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-xs text-muted-foreground">Stored Hash</p><p className="text-foreground font-mono text-xs break-all mt-1">{audit.stored_hash}</p></div>
                        <div><p className="text-xs text-muted-foreground">Verified Hash</p><p className={`font-mono text-xs break-all mt-1 ${isPass ? 'text-emerald-400' : 'text-red-400'}`}>{audit.verified_hash}</p></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {!loading && filtered.length === 0 && <div className="text-center py-12 text-muted-foreground">No audit records found</div>}
      </div>
    </ProtectedLayout>
  );
}
