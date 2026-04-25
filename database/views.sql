-- ============================================================
-- EvidenX — SQL Views
-- ============================================================
USE evidence_vault;

-- 1. vw_evidence_summary
--    Joins Evidence with Evidence_Version, returns evidence ID,
--    description, created_at, version count, and latest version time
DROP VIEW IF EXISTS vw_evidence_summary;
CREATE VIEW vw_evidence_summary AS
SELECT
    e.evidence_id,
    e.case_id,
    e.description,
    e.status,
    e.location,
    e.size_bytes,
    e.created_at,
    COUNT(ev.version_id)          AS version_count,
    MAX(ev.version_time)          AS latest_version_time
FROM Evidence e
LEFT JOIN Evidence_Version ev ON e.evidence_id = ev.evidence_id
GROUP BY e.evidence_id, e.case_id, e.description, e.status,
         e.location, e.size_bytes, e.created_at;

-- 2. vw_custody_chain
--    Joins Custody_Event, Evidence_Version, Evidence, Actor, Access_Log
--    Returns full chain of custody ordered by most recent first
DROP VIEW IF EXISTS vw_custody_chain;
CREATE VIEW vw_custody_chain AS
SELECT
    ce.event_id,
    e.evidence_id,
    e.description       AS evidence_description,
    ev.version_id,
    ev.version_number,
    ev.hash_value,
    a.actor_id,
    a.name              AS actor_name,
    a.role              AS actor_role,
    a.badge             AS actor_badge,
    ce.action_type,
    ce.location,
    ce.notes,
    ce.event_time,
    al.log_id           AS access_log_id,
    al.access_time
FROM Custody_Event ce
JOIN Evidence_Version ev ON ce.version_id = ev.version_id
JOIN Evidence e          ON ev.evidence_id = e.evidence_id
JOIN Actor a             ON ce.actor_id = a.actor_id
LEFT JOIN Access_Log al  ON al.version_id = ce.version_id
                        AND al.action_type = ce.action_type
                        AND al.access_time = ce.event_time
ORDER BY ce.event_time DESC;

-- 3. vw_integrity_status
--    Joins Integrity_Audit with Evidence and Evidence_Version
--    Computes PASS or FAIL by comparing verified_hash with hash_value
DROP VIEW IF EXISTS vw_integrity_status;
CREATE VIEW vw_integrity_status AS
SELECT
    ia.audit_id,
    e.evidence_id,
    e.description       AS evidence_description,
    ev.version_id,
    ev.version_number,
    ev.hash_value        AS stored_hash,
    ia.verified_hash,
    ia.audit_time,
    CASE
        WHEN ia.verified_hash = ev.hash_value THEN 'PASS'
        ELSE 'FAIL'
    END AS integrity_status
FROM Integrity_Audit ia
JOIN Evidence e          ON ia.evidence_id = e.evidence_id
JOIN Evidence_Version ev ON ia.version_id = ev.version_id
ORDER BY ia.audit_time DESC;
