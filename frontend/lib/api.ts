// API configuration and helper functions
const API_BASE = 'http://localhost:5000/api';

export const api = {
  // Evidence
  getEvidence: () => fetch(`${API_BASE}/evidence`).then(r => r.json()),
  getEvidenceById: (id: string) => fetch(`${API_BASE}/evidence/${id}`).then(r => r.json()),
  createEvidence: (data: any) => fetch(`${API_BASE}/evidence`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  }).then(r => r.json()),
  updateEvidence: (id: string, data: any) => fetch(`${API_BASE}/evidence/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  }).then(r => r.json()),
  deleteEvidence: async (id: string) => {
    const r = await fetch(`${API_BASE}/evidence/${id}`, { method: 'DELETE' });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Failed to delete evidence');
    return data;
  },

  // Versions
  // Versions
  getAllVersions: () => fetch(`${API_BASE}/versions`).then(r => r.json()),
  getVersions: (evidenceId: string) => fetch(`${API_BASE}/versions/evidence/${evidenceId}`).then(r => r.json()),
  createVersion: (data: any) => fetch(`${API_BASE}/versions`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  }).then(r => r.json()),
  updateVersion: async (id: string, data: any) => {
    const r = await fetch(`${API_BASE}/versions/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    const result = await r.json();
    if (!r.ok) throw new Error(result.error || 'Failed to update version');
    return result;
  },
  deleteVersion: async (id: string) => {
    const r = await fetch(`${API_BASE}/versions/${id}`, { method: 'DELETE' });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Failed to delete version');
    return data;
  },

  // Custody
  getCustodyEvents: () => fetch(`${API_BASE}/custody`).then(r => r.json()),
  getCustodyChain: (evidenceId: string) => fetch(`${API_BASE}/custody/evidence/${evidenceId}`).then(r => r.json()),
  createCustodyEvent: (data: any) => fetch(`${API_BASE}/custody`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  }).then(r => r.json()),
  updateCustodyEvent: async (id: string, data: any) => {
    const r = await fetch(`${API_BASE}/custody/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    const result = await r.json();
    if (!r.ok) throw new Error(result.error || 'Failed to update custody event');
    return result;
  },
  deleteCustodyEvent: async (id: string) => {
    const r = await fetch(`${API_BASE}/custody/${id}`, { method: 'DELETE' });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Failed to delete custody event');
    return data;
  },

  // Access Log
  // Access Log
  getAccessLogs: () => fetch(`${API_BASE}/accesslog`).then(r => r.json()),
  getAccessLogsByVersion: (versionId: string) => fetch(`${API_BASE}/accesslog/version/${versionId}`).then(r => r.json()),
  createAccessLog: async (data: any) => {
    const r = await fetch(`${API_BASE}/accesslog`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    const result = await r.json();
    if (!r.ok) throw new Error(result.error || 'Failed to create access log');
    return result;
  },
  updateAccessLog: async (id: string, data: any) => {
    const r = await fetch(`${API_BASE}/accesslog/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    const result = await r.json();
    if (!r.ok) throw new Error(result.error || 'Failed to update access log');
    return result;
  },
  deleteAccessLog: async (id: string) => {
    const r = await fetch(`${API_BASE}/accesslog/${id}`, { method: 'DELETE' });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Failed to delete access log');
    return data;
  },

  // Actors
  getActors: () => fetch(`${API_BASE}/actors`).then(r => r.json()),
  getActorById: (id: string) => fetch(`${API_BASE}/actors/${id}`).then(r => r.json()),
  createActor: (data: any) => fetch(`${API_BASE}/actors`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  }).then(r => r.json()),
  updateActor: (id: string, data: any) => fetch(`${API_BASE}/actors/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  }).then(r => r.json()),
  deleteActor: async (id: string) => {
    const r = await fetch(`${API_BASE}/actors/${id}`, { method: 'DELETE' });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Failed to delete actor');
    return data;
  },

  // Audit
  getAudits: () => fetch(`${API_BASE}/audit`).then(r => r.json()),
  getAuditsByEvidence: (evidenceId: string) => fetch(`${API_BASE}/audit/evidence/${evidenceId}`).then(r => r.json()),
  createAudit: async (data: any) => {
    const r = await fetch(`${API_BASE}/audit`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    const result = await r.json();
    if (!r.ok) throw new Error(result.error || 'Failed to create audit');
    return result;
  },
  updateAudit: async (id: string, data: any) => {
    const r = await fetch(`${API_BASE}/audit/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    const result = await r.json();
    if (!r.ok) throw new Error(result.error || 'Failed to update audit');
    return result;
  },
  deleteAudit: async (id: string) => {
    const r = await fetch(`${API_BASE}/audit/${id}`, { method: 'DELETE' });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Failed to delete audit');
    return data;
  },
  runAudit: (data: any) => fetch(`${API_BASE}/audit/run`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  }).then(r => r.json()),
  batchAudit: () => fetch(`${API_BASE}/audit/batch`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
  }).then(r => r.json()),

  // Views
  getEvidenceSummary: () => fetch(`${API_BASE}/views/evidence-summary`).then(r => r.json()),
  getCustodyChainView: () => fetch(`${API_BASE}/views/custody-chain`).then(r => r.json()),
  getIntegrityStatus: () => fetch(`${API_BASE}/views/integrity-status`).then(r => r.json()),
};
