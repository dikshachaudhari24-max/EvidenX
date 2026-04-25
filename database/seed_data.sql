-- ============================================================
-- EvidenX — Seed Data
-- ============================================================
USE evidence_vault;

-- ────────────────────────────────────────
-- ACTORS (5 with different roles)
-- ────────────────────────────────────────
INSERT INTO Actor (actor_id, name, role, email, department, badge) VALUES
('a1000000-0000-0000-0000-000000000001', 'Detective Sarah Chen',    'investigator', 'sarah.chen@pd.local',       'Homicide Division',     'PD-4521'),
('a1000000-0000-0000-0000-000000000002', 'Dr. James Rodriguez',     'analyst',      'james.rodriguez@lab.local', 'Forensic Lab',          'LAB-0847'),
('a1000000-0000-0000-0000-000000000003', 'Officer Michael Torres',  'custodian',    'michael.torres@pd.local',   'Evidence Management',   'EM-3294'),
('a1000000-0000-0000-0000-000000000004', 'Captain Lisa Hoffman',    'admin',        'lisa.hoffman@pd.local',     'Administration',        'ADM-0015'),
('a1000000-0000-0000-0000-000000000005', 'Agent Rachel Kim',        'investigator', 'rachel.kim@fbi.local',      'Cybercrime Unit',       'FBI-7712');

-- ────────────────────────────────────────
-- EVIDENCE (6 records)
-- ────────────────────────────────────────
INSERT INTO Evidence (evidence_id, case_id, description, type, status, location, size_bytes, created_at) VALUES
('e1000000-0000-0000-0000-000000000001', 'CASE-2024-0847', 'DNA Sample - Saliva Swab',             'Biological',       'analyzed',     'Cold Storage Room 2',       256,     '2024-03-15 09:30:00'),
('e1000000-0000-0000-0000-000000000002', 'CASE-2024-0847', 'Fiber Evidence - Clothing',             'Trace Evidence',   'secured',      'Containment Locker 7',      1024,    '2024-03-20 08:15:00'),
('e1000000-0000-0000-0000-000000000003', 'CASE-2024-0921', 'Digital Evidence - Smartphone',         'Digital Forensics','archived',     'Secure Server Storage',     1048576, '2024-02-28 10:00:00'),
('e1000000-0000-0000-0000-000000000004', 'CASE-2024-0756', 'Ballistic Evidence - Bullet Casing',   'Physical Items',   'compromised',  'Compromised Storage Unit',  512,     '2024-03-10 13:45:00'),
('e1000000-0000-0000-0000-000000000005', 'CASE-2024-1102', 'Surveillance Footage - Parking Garage', 'Images & Video',  'secured',      'Media Vault A',             5242880, '2024-04-01 16:00:00'),
('e1000000-0000-0000-0000-000000000006', 'CASE-2024-1102', 'GPS Location Data - Suspect Vehicle',   'Location Data',   'analyzed',     'Server Rack B-12',          2048,    '2024-04-05 11:20:00');

-- ────────────────────────────────────────
-- EVIDENCE_VERSION (3 per evidence = 18 total)
-- NOTE: The trg_auto_audit_on_version_insert trigger will auto-create
--       Integrity_Audit records for each version insert.
--       We disable the trigger temporarily and insert audit records manually
--       so we can control the data (including a FAIL case).
-- ────────────────────────────────────────

-- Temporarily disable the auto-audit trigger by dropping and re-creating later
-- Instead, we'll just let the trigger fire and then add our FAIL case manually.

-- Evidence 1 — DNA Sample (3 versions)
INSERT INTO Evidence_Version (version_id, evidence_id, version_number, hash_value, version_time, notes) VALUES
('v1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 1, 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2', '2024-03-15 09:30:00', 'Initial intake hash'),
('v1000000-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000001', 2, 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2', '2024-03-15 14:30:00', 'Post-transfer verification'),
('v1000000-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000001', 3, 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2', '2024-03-16 12:00:00', 'Post-analysis verification');

-- Evidence 2 — Fiber Evidence (3 versions)
INSERT INTO Evidence_Version (version_id, evidence_id, version_number, hash_value, version_time, notes) VALUES
('v1000000-0000-0000-0000-000000000004', 'e1000000-0000-0000-0000-000000000002', 1, 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3', '2024-03-20 08:15:00', 'Initial intake hash'),
('v1000000-0000-0000-0000-000000000005', 'e1000000-0000-0000-0000-000000000002', 2, 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3', '2024-03-21 10:00:00', 'Storage verification'),
('v1000000-0000-0000-0000-000000000006', 'e1000000-0000-0000-0000-000000000002', 3, 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3', '2024-03-22 15:30:00', 'Periodic check');

-- Evidence 3 — Smartphone (3 versions)
INSERT INTO Evidence_Version (version_id, evidence_id, version_number, hash_value, version_time, notes) VALUES
('v1000000-0000-0000-0000-000000000007', 'e1000000-0000-0000-0000-000000000003', 1, 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4', '2024-02-28 10:00:00', 'Initial forensic image hash'),
('v1000000-0000-0000-0000-000000000008', 'e1000000-0000-0000-0000-000000000003', 2, 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4', '2024-03-05 09:00:00', 'Re-verification after extraction'),
('v1000000-0000-0000-0000-000000000009', 'e1000000-0000-0000-0000-000000000003', 3, 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4', '2024-03-12 14:45:00', 'Archival verification');

-- Evidence 4 — Bullet Casing (3 versions)
INSERT INTO Evidence_Version (version_id, evidence_id, version_number, hash_value, version_time, notes) VALUES
('v1000000-0000-0000-0000-000000000010', 'e1000000-0000-0000-0000-000000000004', 1, 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5', '2024-03-10 13:45:00', 'Initial intake hash'),
('v1000000-0000-0000-0000-000000000011', 'e1000000-0000-0000-0000-000000000004', 2, 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5', '2024-03-12 09:00:00', 'Transfer verification'),
('v1000000-0000-0000-0000-000000000012', 'e1000000-0000-0000-0000-000000000004', 3, 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', '2024-03-14 16:30:00', 'COMPROMISED — hash changed after unauthorized access');

-- Evidence 5 — Surveillance Footage (3 versions)
INSERT INTO Evidence_Version (version_id, evidence_id, version_number, hash_value, version_time, notes) VALUES
('v1000000-0000-0000-0000-000000000013', 'e1000000-0000-0000-0000-000000000005', 1, 'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6', '2024-04-01 16:00:00', 'Initial video file hash'),
('v1000000-0000-0000-0000-000000000014', 'e1000000-0000-0000-0000-000000000005', 2, 'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6', '2024-04-03 08:00:00', 'Integrity check before analysis'),
('v1000000-0000-0000-0000-000000000015', 'e1000000-0000-0000-0000-000000000005', 3, 'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6', '2024-04-05 12:00:00', 'Post-review verification');

-- Evidence 6 — GPS Data (3 versions)
INSERT INTO Evidence_Version (version_id, evidence_id, version_number, hash_value, version_time, notes) VALUES
('v1000000-0000-0000-0000-000000000016', 'e1000000-0000-0000-0000-000000000006', 1, 'f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7', '2024-04-05 11:20:00', 'Initial GPS data hash'),
('v1000000-0000-0000-0000-000000000017', 'e1000000-0000-0000-0000-000000000006', 2, 'f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7', '2024-04-07 09:30:00', 'Correlation verification'),
('v1000000-0000-0000-0000-000000000018', 'e1000000-0000-0000-0000-000000000006', 3, 'f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7', '2024-04-09 14:00:00', 'Final analysis verification');

-- ────────────────────────────────────────
-- CUSTODY_EVENT (at least one per evidence, using latest version)
-- NOTE: trg_log_access_on_custody_event will auto-create Access_Log entries
-- ────────────────────────────────────────

-- Evidence 1 custody events
INSERT INTO Custody_Event (event_id, version_id, actor_id, action_type, location, notes, event_time) VALUES
('ce100000-0000-0000-0000-000000000001', 'v1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'received',    'Main Evidence Room',       'Evidence received from scene collection team',  '2024-03-15 09:30:00'),
('ce100000-0000-0000-0000-000000000002', 'v1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000003', 'transferred', 'Lab Processing Room 2',    'Transferred to forensic lab for analysis',       '2024-03-15 14:22:00'),
('ce100000-0000-0000-0000-000000000003', 'v1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002', 'analyzed',    'Lab Analysis Station A',   'DNA analysis completed',                         '2024-03-16 11:45:00');

-- Evidence 2 custody events
INSERT INTO Custody_Event (event_id, version_id, actor_id, action_type, location, notes, event_time) VALUES
('ce100000-0000-0000-0000-000000000004', 'v1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 'received',    'Main Evidence Room',       'Physical evidence received',                     '2024-03-20 08:15:00'),
('ce100000-0000-0000-0000-000000000005', 'v1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000003', 'transferred', 'Containment Locker 7',     'Secured in containment locker',                  '2024-03-21 10:30:00');

-- Evidence 3 custody events
INSERT INTO Custody_Event (event_id, version_id, actor_id, action_type, location, notes, event_time) VALUES
('ce100000-0000-0000-0000-000000000006', 'v1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000005', 'received',    'Digital Intake Lab',       'Smartphone received for forensic imaging',       '2024-02-28 10:00:00'),
('ce100000-0000-0000-0000-000000000007', 'v1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000002', 'analyzed',    'Cyber Lab Station 3',      'Full data extraction and analysis complete',     '2024-03-05 09:30:00'),
('ce100000-0000-0000-0000-000000000008', 'v1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000004', 'released',    'Archive Storage',          'Released to long-term archive',                  '2024-03-12 15:00:00');

-- Evidence 4 custody events
INSERT INTO Custody_Event (event_id, version_id, actor_id, action_type, location, notes, event_time) VALUES
('ce100000-0000-0000-0000-000000000009', 'v1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000001', 'received',    'Ballistics Lab Intake',    'Bullet casing received from crime scene',        '2024-03-10 13:45:00'),
('ce100000-0000-0000-0000-000000000010', 'v1000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000002', 'analyzed',    'Ballistics Analysis Room', 'Ballistic comparison completed',                 '2024-03-12 09:30:00');

-- Evidence 5 custody events
INSERT INTO Custody_Event (event_id, version_id, actor_id, action_type, location, notes, event_time) VALUES
('ce100000-0000-0000-0000-000000000011', 'v1000000-0000-0000-0000-000000000013', 'a1000000-0000-0000-0000-000000000003', 'received',    'Media Vault A',            'Surveillance footage securely received',         '2024-04-01 16:00:00'),
('ce100000-0000-0000-0000-000000000012', 'v1000000-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000005', 'analyzed',    'Video Analysis Suite',     'Frame-by-frame analysis in progress',            '2024-04-03 08:30:00');

-- Evidence 6 custody events
INSERT INTO Custody_Event (event_id, version_id, actor_id, action_type, location, notes, event_time) VALUES
('ce100000-0000-0000-0000-000000000013', 'v1000000-0000-0000-0000-000000000016', 'a1000000-0000-0000-0000-000000000005', 'received',    'Cyber Lab Intake',         'GPS data extracted from vehicle tracker',        '2024-04-05 11:20:00'),
('ce100000-0000-0000-0000-000000000014', 'v1000000-0000-0000-0000-000000000017', 'a1000000-0000-0000-0000-000000000002', 'analyzed',    'GIS Analysis Room',        'Location data correlated with suspect timeline', '2024-04-07 10:00:00');

-- ────────────────────────────────────────
-- MANUALLY ADD INTEGRITY AUDIT FAIL CASE
-- (The trigger already created PASS records for all versions above.
--  We add an explicit FAIL record for Evidence 4, Version 3 — the compromised one.)
-- ────────────────────────────────────────
INSERT INTO Integrity_Audit (audit_id, evidence_id, version_id, verified_hash, audit_time, result) VALUES
('ia100000-0000-0000-0000-0000000000FF', 'e1000000-0000-0000-0000-000000000004', 'v1000000-0000-0000-0000-000000000012',
 'TAMPERED_HASH_VALUE_DOES_NOT_MATCH_ORIGINAL',
 '2024-03-15 08:00:00', 'FAIL');
