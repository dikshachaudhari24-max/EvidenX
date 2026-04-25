// Evidence Data Types
export type EvidenceStatus = 'secured' | 'analyzed' | 'archived' | 'compromised';
export type CustodyEventType = 'received' | 'transferred' | 'analyzed' | 'released' | 'destroyed';
export type ActorRole = 'investigator' | 'analyst' | 'custodian' | 'admin';
export type TriggerType = 'manual' | 'automated' | 'scheduled';
export type AuditLevel = 'critical' | 'warning' | 'info';

export interface Evidence {
  id: string;
  caseId: string;
  description: string;
  status: EvidenceStatus;
  receivedDate: Date;
  analyzer?: string;
  chain: CustodyEvent[];
  hashSHA256: string;
  sizeBytes: number;
  location: string;
}

export interface CustodyEvent {
  id: string;
  evidenceId: string;
  eventType: CustodyEventType;
  actor: Actor;
  timestamp: Date;
  notes: string;
  location: string;
}

export interface Actor {
  id: string;
  name: string;
  role: ActorRole;
  email: string;
  department: string;
  badge: string;
}

export interface SQLView {
  id: string;
  name: string;
  description: string;
  query: string;
  lastExecuted: Date;
  rowCount: number;
}

export interface Trigger {
  id: string;
  name: string;
  type: TriggerType;
  condition: string;
  action: string;
  enabled: boolean;
  lastFired?: Date;
}

export interface IntegrityAudit {
  id: string;
  timestamp: Date;
  level: AuditLevel;
  title: string;
  description: string;
  affectedRecords: number;
  resolution?: string;
}

export interface DashboardKPI {
  label: string;
  value: number;
  change: number;
  unit?: string;
}
