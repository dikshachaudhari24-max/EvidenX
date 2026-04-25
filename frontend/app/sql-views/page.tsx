'use client';

import { ProtectedLayout } from '@/components/protected-layout';
import { api } from '@/lib/api';
import { Copy, Clock, Loader2, Play } from 'lucide-react';
import { useState } from 'react';

const viewDefinitions = [
  {
    id: 'vw_evidence_summary',
    name: 'vw_evidence_summary',
    description: 'Joins Evidence with Evidence_Version — returns evidence ID, description, created_at, version count, and latest version time',
    query: `SELECT e.evidence_id, e.case_id, e.description, e.status, e.location,
  e.size_bytes, e.created_at, COUNT(ev.version_id) AS version_count,
  MAX(ev.version_time) AS latest_version_time
FROM Evidence e
LEFT JOIN Evidence_Version ev ON e.evidence_id = ev.evidence_id
GROUP BY e.evidence_id, e.case_id, e.description, e.status,
         e.location, e.size_bytes, e.created_at;`,
    fetchFn: api.getEvidenceSummary,
  },
  {
    id: 'vw_custody_chain',
    name: 'vw_custody_chain',
    description: 'Full chain of custody with actor name, role, action type, location, and access time',
    query: `SELECT ce.event_id, e.evidence_id, e.description, ev.version_id,
  a.name AS actor_name, a.role AS actor_role, ce.action_type,
  ce.location, ce.event_time, al.access_time
FROM Custody_Event ce
JOIN Evidence_Version ev ON ce.version_id = ev.version_id
JOIN Evidence e ON ev.evidence_id = e.evidence_id
JOIN Actor a ON ce.actor_id = a.actor_id
LEFT JOIN Access_Log al ON al.version_id = ce.version_id
ORDER BY ce.event_time DESC;`,
    fetchFn: api.getCustodyChainView,
  },
  {
    id: 'vw_integrity_status',
    name: 'vw_integrity_status',
    description: 'Computes PASS or FAIL by comparing verified_hash with hash_value from Evidence_Version',
    query: `SELECT ia.audit_id, e.evidence_id, e.description,
  ev.hash_value AS stored_hash, ia.verified_hash,
  CASE WHEN ia.verified_hash = ev.hash_value THEN 'PASS' ELSE 'FAIL' END AS integrity_status
FROM Integrity_Audit ia
JOIN Evidence e ON ia.evidence_id = e.evidence_id
JOIN Evidence_Version ev ON ia.version_id = ev.version_id
ORDER BY ia.audit_time DESC;`,
    fetchFn: api.getIntegrityStatus,
  },
];

export default function SQLViewsPage() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [resultsLoading, setResultsLoading] = useState(false);

  const selectedView = viewDefinitions[selectedIdx];

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedView.query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = async () => {
    setResultsLoading(true);
    try {
      const data = await selectedView.fetchFn();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to run view:', err);
      setResults([]);
    } finally {
      setResultsLoading(false);
    }
  };

  return (
    <ProtectedLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">SQL Views</h1>
          <p className="text-muted-foreground mt-2">Database views and queries for evidence management</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Available Views</h2>
              <div className="space-y-2">
                {viewDefinitions.map((view, idx) => (
                  <button key={view.id} onClick={() => { setSelectedIdx(idx); setResults(null); }}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${selectedIdx === idx ? 'bg-accent text-accent-foreground' : 'bg-slate-900/50 text-foreground hover:bg-slate-900'}`}>
                    <p className="font-mono text-xs mb-1">{view.name}</p>
                    <p className="text-xs text-muted-foreground">{view.description.substring(0, 50)}...</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{selectedView.name}</h2>
                <p className="text-muted-foreground mt-2 text-sm">{selectedView.description}</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground">Query</h3>
                  <div className="flex gap-2">
                    <button onClick={handleCopy}
                      className="flex items-center gap-2 px-3 py-1 text-xs font-medium bg-slate-900/50 hover:bg-slate-800 text-foreground rounded transition-colors">
                      <Copy className="w-4 h-4" />{copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button onClick={handleRun} disabled={resultsLoading}
                      className="flex items-center gap-2 px-3 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
                      {resultsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                      Run
                    </button>
                  </div>
                </div>
                <div className="bg-slate-950 rounded-lg p-4 overflow-auto max-h-64 border border-border">
                  <code className="text-sm text-cyan-400 font-mono whitespace-pre-wrap break-words">{selectedView.query}</code>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="text-sm font-semibold text-foreground mb-3">Results</h3>
                {resultsLoading ? (
                  <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
                ) : results ? (
                  <div className="bg-slate-950 rounded-lg border border-border overflow-auto max-h-80">
                    {results.length > 0 ? (
                      <table className="w-full text-xs">
                        <thead><tr className="border-b border-border">
                          {Object.keys(results[0]).map((key) => (
                            <th key={key} className="text-left py-2 px-3 text-muted-foreground font-medium whitespace-nowrap">{key}</th>
                          ))}
                        </tr></thead>
                        <tbody>
                          {results.slice(0, 50).map((row, idx) => (
                            <tr key={idx} className="border-b border-border/50 hover:bg-slate-900/50">
                              {Object.values(row).map((val: any, i) => (
                                <td key={i} className="py-2 px-3 text-foreground whitespace-nowrap max-w-xs truncate">{val != null ? String(val) : '—'}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : <p className="p-4 text-slate-400 text-xs">No rows returned</p>}
                  </div>
                ) : <p className="text-xs text-slate-400 p-4 bg-slate-950 rounded-lg">Click &quot;Run&quot; to execute this view</p>}
                {results && <p className="text-xs text-muted-foreground mt-2">{results.length} row(s) returned</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
