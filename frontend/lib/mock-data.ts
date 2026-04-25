import {
  Evidence,
  CustodyEvent,
  Actor,
  SQLView,
  Trigger,
  IntegrityAudit,
  DashboardKPI,
} from './types';

export const mockActors: Actor[] = [
  {
    id: 'actor-001',
    name: 'Detective Sarah Chen',
    role: 'investigator',
    email: 'sarah.chen@pd.local',
    department: 'Homicide Division',
    badge: 'PD-4521',
  },
  {
    id: 'actor-002',
    name: 'Dr. James Rodriguez',
    role: 'analyst',
    email: 'james.rodriguez@lab.local',
    department: 'Forensic Lab',
    badge: 'LAB-0847',
  },
  {
    id: 'actor-003',
    name: 'Officer Michael Torres',
    role: 'custodian',
    email: 'michael.torres@pd.local',
    department: 'Evidence Management',
    badge: 'EM-3294',
  },
  {
    id: 'actor-004',
    name: 'Captain Lisa Hoffman',
    role: 'admin',
    email: 'lisa.hoffman@pd.local',
    department: 'Administration',
    badge: 'ADM-0015',
  },
];

export const mockCustodyEvents: CustodyEvent[] = [
  {
    id: 'event-001',
    evidenceId: 'evid-001',
    eventType: 'received',
    actor: mockActors[0],
    timestamp: new Date('2024-03-15T09:30:00Z'),
    notes: 'Evidence received from scene collection team',
    location: 'Main Evidence Room',
  },
  {
    id: 'event-002',
    evidenceId: 'evid-001',
    eventType: 'transferred',
    actor: mockActors[2],
    timestamp: new Date('2024-03-15T14:22:00Z'),
    notes: 'Transferred to forensic lab for analysis',
    location: 'Lab Processing Room 2',
  },
  {
    id: 'event-003',
    evidenceId: 'evid-001',
    eventType: 'analyzed',
    actor: mockActors[1],
    timestamp: new Date('2024-03-16T11:45:00Z'),
    notes: 'DNA analysis completed',
    location: 'Lab Analysis Station A',
  },
  {
    id: 'event-004',
    evidenceId: 'evid-002',
    eventType: 'received',
    actor: mockActors[0],
    timestamp: new Date('2024-03-20T08:15:00Z'),
    notes: 'Physical evidence received',
    location: 'Main Evidence Room',
  },
];

export const mockEvidence: Evidence[] = [
  {
    id: 'evid-001',
    caseId: 'CASE-2024-0847',
    description: 'DNA Sample - Saliva Swab',
    status: 'analyzed',
    receivedDate: new Date('2024-03-15T09:30:00Z'),
    analyzer: 'Dr. James Rodriguez',
    chain: mockCustodyEvents.slice(0, 3),
    hashSHA256: 'a1f2b3c4d5e6f7g8h9i0j1k2l3m4n5o6',
    sizeBytes: 256,
    location: 'Cold Storage Room 2',
  },
  {
    id: 'evid-002',
    caseId: 'CASE-2024-0847',
    description: 'Fiber Evidence - Clothing',
    status: 'secured',
    receivedDate: new Date('2024-03-20T08:15:00Z'),
    chain: mockCustodyEvents.slice(3, 4),
    hashSHA256: 'p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4',
    sizeBytes: 1024,
    location: 'Containment Locker 7',
  },
  {
    id: 'evid-003',
    caseId: 'CASE-2024-0921',
    description: 'Digital Evidence - Smartphone',
    status: 'archived',
    receivedDate: new Date('2024-02-28T10:00:00Z'),
    analyzer: 'Dr. James Rodriguez',
    chain: [],
    hashSHA256: 'q1w2e3r4t5y6u7i8o9p0a1s2d3f4g5h6',
    sizeBytes: 1048576,
    location: 'Secure Server Storage',
  },
  {
    id: 'evid-004',
    caseId: 'CASE-2024-0756',
    description: 'Ballistic Evidence - Bullet Casing',
    status: 'compromised',
    receivedDate: new Date('2024-03-10T13:45:00Z'),
    chain: [],
    hashSHA256: 'z8x7c6v5b4n3m2l1k0j9h8g7f6d5s4a3',
    sizeBytes: 512,
    location: 'Compromised Storage Unit',
  },
];

export const mockSQLViews: SQLView[] = [
  {
    id: 'view-001',
    name: 'active_evidence_by_case',
    description: 'Returns all non-archived evidence grouped by case',
    query:
      'SELECT case_id, COUNT(*) as count FROM evidence WHERE status != \'archived\' GROUP BY case_id',
    lastExecuted: new Date('2024-03-21T16:30:00Z'),
    rowCount: 12,
  },
  {
    id: 'view-002',
    name: 'chain_of_custody_history',
    description: 'Complete chain of custody for each evidence item',
    query:
      'SELECT e.id, e.description, ce.event_type, a.name, ce.timestamp FROM evidence e LEFT JOIN custody_events ce ON e.id = ce.evidence_id LEFT JOIN actors a ON ce.actor_id = a.id ORDER BY e.id, ce.timestamp',
    lastExecuted: new Date('2024-03-21T15:15:00Z'),
    rowCount: 47,
  },
  {
    id: 'view-003',
    name: 'audit_log_summary',
    description: 'Summary of all audit events by level',
    query:
      'SELECT level, COUNT(*) as count, MAX(timestamp) as latest FROM integrity_audits GROUP BY level',
    lastExecuted: new Date('2024-03-21T14:22:00Z'),
    rowCount: 3,
  },
];

export const mockTriggers: Trigger[] = [
  {
    id: 'trig-001',
    name: 'Auto-Archive Old Evidence',
    type: 'scheduled',
    condition: 'evidence.status = analyzed AND days_since(received_date) > 365',
    action: 'UPDATE evidence SET status = archived WHERE condition met',
    enabled: true,
    lastFired: new Date('2024-03-20T00:15:00Z'),
  },
  {
    id: 'trig-002',
    name: 'Alert on Chain Break',
    type: 'automated',
    condition: 'custody_event created without valid actor_id',
    action: 'CREATE integrity_audit with level critical',
    enabled: true,
    lastFired: new Date('2024-03-18T09:45:00Z'),
  },
  {
    id: 'trig-003',
    name: 'Manual Review Required',
    type: 'manual',
    condition: 'evidence.status = compromised',
    action: 'NOTIFY admin and create integrity_audit',
    enabled: true,
  },
];

export const mockIntegrityAudits: IntegrityAudit[] = [
  {
    id: 'audit-001',
    timestamp: new Date('2024-03-21T14:30:00Z'),
    level: 'critical',
    title: 'Chain of Custody Break Detected',
    description: 'Evidence EVID-004 shows missing transfer log entry',
    affectedRecords: 1,
    resolution:
      'Reviewed security footage, added missing entry at 2024-03-21 14:45:00',
  },
  {
    id: 'audit-002',
    timestamp: new Date('2024-03-20T10:15:00Z'),
    level: 'warning',
    title: 'Late Custody Transfer',
    description: '4 items transferred after standard 24-hour window',
    affectedRecords: 4,
    resolution:
      'Approved by supervisor - delays due to lab backlog on 2024-03-19',
  },
  {
    id: 'audit-003',
    timestamp: new Date('2024-03-19T16:20:00Z'),
    level: 'info',
    title: 'Database Integrity Check',
    description: 'Routine integrity validation passed',
    affectedRecords: 156,
  },
  {
    id: 'audit-004',
    timestamp: new Date('2024-03-18T09:45:00Z'),
    level: 'critical',
    title: 'Unauthorized Access Attempt',
    description: 'Failed login attempt from unknown IP detected',
    affectedRecords: 0,
    resolution: 'Incident report filed, IP blocked',
  },
];

export const mockKPIs: DashboardKPI[] = [
  { label: 'Active Cases', value: 12, change: 2, unit: 'cases' },
  { label: 'Total Evidence Items', value: 156, change: 8, unit: 'items' },
  { label: 'Chain Integrity', value: 99.8, change: 0.1, unit: '%' },
  { label: 'Avg Processing Time', value: 2.3, change: -0.4, unit: 'days' },
];
