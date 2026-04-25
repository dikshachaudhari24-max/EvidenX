'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ProtectedLayout } from '@/components/protected-layout';
import { AddEvidenceModal } from '@/components/add-evidence-modal';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Plus, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api } from '@/lib/api';

const chartData = [
  { name: 'Mon', cases: 2, evidence: 12 },
  { name: 'Tue', cases: 3, evidence: 15 },
  { name: 'Wed', cases: 2, evidence: 10 },
  { name: 'Thu', cases: 4, evidence: 18 },
  { name: 'Fri', cases: 3, evidence: 14 },
  { name: 'Sat', cases: 1, evidence: 8 },
  { name: 'Sun', cases: 2, evidence: 11 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [isAddEvidenceOpen, setIsAddEvidenceOpen] = useState(false);
  const [evidence, setEvidence] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await api.getEvidence();
      setEvidence(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load evidence:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const statusCounts: Record<string, number> = {};
  evidence.forEach(e => { statusCounts[e.status] = (statusCounts[e.status] || 0) + 1; });

  const kpis = [
    { label: 'Active Cases', value: new Set(evidence.map(e => e.case_id)).size, change: 0, unit: 'cases' },
    { label: 'Total Evidence Items', value: evidence.length, change: 0, unit: 'items' },
    { label: 'Chain Integrity', value: evidence.length > 0 ? ((1 - (statusCounts['compromised'] || 0) / evidence.length) * 100).toFixed(1) : '100.0', change: 0, unit: '%' },
    { label: 'Secured Items', value: statusCounts['secured'] || 0, change: 0, unit: 'items' },
  ];

  const statusDistribution = [
    { name: 'Secured', value: statusCounts['secured'] || 0, fill: '#10b981' },
    { name: 'Analyzed', value: statusCounts['analyzed'] || 0, fill: '#3b82f6' },
    { name: 'Archived', value: statusCounts['archived'] || 0, fill: '#6b7280' },
    { name: 'Compromised', value: statusCounts['compromised'] || 0, fill: '#ef4444' },
  ];

  return (
    <ProtectedLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Overview of evidence management and case status</p>
          </div>
          {user?.role === 'admin' && (
            <Button
              onClick={() => setIsAddEvidenceOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Evidence
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {kpis.map((kpi, idx) => (
                <div key={idx} className="bg-card border border-border rounded-lg p-6">
                  <p className="text-sm text-muted-foreground font-medium">{kpi.label}</p>
                  <div className="flex items-end justify-between mt-4">
                    <div>
                      <p className="text-3xl font-bold text-foreground">
                        {kpi.value}
                        {kpi.unit && <span className="text-sm text-muted-foreground ml-1">{kpi.unit}</span>}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Activity */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-6">Weekly Activity</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#131619',
                        border: '1px solid #1e293b',
                        borderRadius: '0.5rem',
                      }}
                      labelStyle={{ color: '#e8eaed' }}
                    />
                    <Legend wrapperStyle={{ color: '#94a3b8' }} />
                    <Bar dataKey="cases" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="evidence" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Status Distribution */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-6">Evidence Status</h2>
                <div className="space-y-4">
                  {statusDistribution.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">{item.name}</span>
                        <span className="text-sm text-muted-foreground">{item.value}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${evidence.length > 0 ? (item.value / evidence.length) * 100 : 0}%`,
                            backgroundColor: item.fill,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Evidence */}
            <div className="mt-8 bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Recent Evidence</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">ID</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Description</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Case</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evidence.slice(0, 5).map((ev) => (
                      <tr key={ev.evidence_id} className="border-b border-border hover:bg-slate-900/50 transition-colors">
                        <td className="py-3 px-4 text-foreground font-mono text-xs">{ev.evidence_id?.substring(0, 8)}...</td>
                        <td className="py-3 px-4 text-foreground">{ev.description}</td>
                        <td className="py-3 px-4 text-foreground">{ev.case_id}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              ev.status === 'secured'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : ev.status === 'analyzed'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : ev.status === 'archived'
                                    ? 'bg-slate-600/20 text-slate-400'
                                    : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {ev.status?.charAt(0).toUpperCase() + ev.status?.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{new Date(ev.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      <AddEvidenceModal open={isAddEvidenceOpen} onOpenChange={setIsAddEvidenceOpen} onSuccess={loadData} />
    </ProtectedLayout>
  );
}
