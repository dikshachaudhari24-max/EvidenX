'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedLayout } from '@/components/protected-layout';
import { InvestigationNotes } from '@/components/investigation-notes';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { mockEvidence } from '@/lib/mock-data';
import { StatusBadge } from '@/components/status-badge';

export default function InvestigatorReportsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && user && user.role !== 'investigator' && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [isLoading, user, router]);

  const loadReports = async () => {
    try {
      const data = await api.getAllVersions();
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load reports:', err);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const groupedReports = useMemo(() => {
    const groups = reports.reduce<Record<string, any[]>>((acc, report) => {
      acc[report.evidence_id] = acc[report.evidence_id] ?? [];
      acc[report.evidence_id].push(report);
      return acc;
    }, {});

    Object.keys(groups).forEach((evidence_id) => {
      groups[evidence_id].sort(
        (a, b) => new Date(b.version_time).getTime() - new Date(a.version_time).getTime()
      );
    });

    return groups;
  }, [reports]);

  const evidenceInvestigationCount = useMemo(
    () => Object.keys(groupedReports).length,
    [groupedReports]
  );

  const lastActivity = useMemo(() => {
    if (reports.length === 0) return null;
    const latest = reports.reduce((max, report) =>
      new Date(report.version_time).getTime() > new Date(max.version_time).getTime() ? report : max
    );
    return latest.version_time;
  }, [reports]);

  if (isLoading) {
    return null;
  }

  if (!user || (user.role !== 'investigator' && user.role !== 'admin')) {
    return null;
  }

  return (
    <ProtectedLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Investigation Reports</h1>
          <p className="text-muted-foreground mt-2">
            Review all investigator-submitted reports by evidence item.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#09090B] border border-zinc-800 rounded-lg p-4">
            <p className="text-xs text-zinc-400 mb-2">Total Reports Submitted</p>
            <p className="text-2xl font-bold text-zinc-100">{reports.length}</p>
          </div>
          <div className="bg-[#09090B] border border-zinc-800 rounded-lg p-4">
            <p className="text-xs text-zinc-400 mb-2">Total Evidence Investigated</p>
            <p className="text-2xl font-bold text-zinc-100">{evidenceInvestigationCount}</p>
          </div>
          <div className="bg-[#09090B] border border-zinc-800 rounded-lg p-4">
            <p className="text-xs text-zinc-400 mb-2">Last Activity</p>
            <p className="text-sm font-medium text-zinc-100">
              {lastActivity ? new Date(lastActivity).toLocaleString() : 'No reports yet'}
            </p>
          </div>
        </div>

        <div className="bg-[#09090B] border border-zinc-800 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-100">All Evidence Items</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900/70 border-b border-zinc-800">
                <tr>
                  <th className="text-left py-3 px-5 text-zinc-400 font-medium">Evidence ID</th>
                  <th className="text-left py-3 px-5 text-zinc-400 font-medium">Description</th>
                  <th className="text-left py-3 px-5 text-zinc-400 font-medium">Case ID</th>
                  <th className="text-left py-3 px-5 text-zinc-400 font-medium">Status</th>
                  <th className="text-left py-3 px-5 text-zinc-400 font-medium">Reports</th>
                  <th className="text-right py-3 px-5 text-zinc-400 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockEvidence.map((evidence) => {
                  const reportCount = groupedReports[evidence.id]?.length ?? 0;
                  return (
                    <tr key={evidence.id} className="border-b border-zinc-800/80 hover:bg-zinc-900/40">
                      <td className="py-3 px-5 text-zinc-100 font-mono text-xs">{evidence.id}</td>
                      <td className="py-3 px-5 text-zinc-200">{evidence.description}</td>
                      <td className="py-3 px-5 text-zinc-300">{evidence.caseId}</td>
                      <td className="py-3 px-5">
                        <StatusBadge status={evidence.status} />
                      </td>
                      <td className="py-3 px-5 text-zinc-300">{reportCount}</td>
                      <td className="py-3 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedEvidenceId(evidence.id);
                            setIsNotesOpen(true);
                          }}
                          className="text-xs px-3 py-1.5 rounded-md border border-zinc-700 text-zinc-200 bg-[#09090B] hover:bg-zinc-900 transition-colors"
                        >
                          Add Report
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <InvestigationNotes
          open={isNotesOpen}
          onOpenChange={(open) => {
            setIsNotesOpen(open);
            if (!open) loadReports(); // refresh when closing drawer
          }}
          evidenceId={selectedEvidenceId}
          investigatorName={user?.name ?? 'Unknown Investigator'}
        />
      </div>
    </ProtectedLayout>
  );
}
