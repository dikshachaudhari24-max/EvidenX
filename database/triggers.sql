-- ============================================================
-- EvidenX — Triggers
-- ============================================================
USE evidence_vault;

-- 1. trg_auto_audit_on_version_insert
--    AFTER INSERT on Evidence_Version → auto-insert Integrity_Audit
DELIMITER //
DROP TRIGGER IF EXISTS trg_auto_audit_on_version_insert//
CREATE TRIGGER trg_auto_audit_on_version_insert
AFTER INSERT ON Evidence_Version
FOR EACH ROW
BEGIN
    INSERT INTO Integrity_Audit (
        audit_id,
        evidence_id,
        version_id,
        verified_hash,
        audit_time,
        result
    ) VALUES (
        UUID(),
        NEW.evidence_id,
        NEW.version_id,
        NEW.hash_value,
        NOW(),
        'PASS'
    );
END//
DELIMITER ;

-- 2. trg_log_access_on_custody_event
--    AFTER INSERT on Custody_Event → auto-insert Access_Log
DELIMITER //
DROP TRIGGER IF EXISTS trg_log_access_on_custody_event//
CREATE TRIGGER trg_log_access_on_custody_event
AFTER INSERT ON Custody_Event
FOR EACH ROW
BEGIN
    INSERT INTO Access_Log (
        log_id,
        version_id,
        access_time,
        action_type
    ) VALUES (
        UUID(),
        NEW.version_id,
        NEW.event_time,
        NEW.action_type
    );
END//
DELIMITER ;

-- 3. trg_flag_hash_mismatch
--    BEFORE UPDATE on Integrity_Audit
--    Checks if new verified_hash matches stored hash_value in Evidence_Version
DELIMITER //
DROP TRIGGER IF EXISTS trg_flag_hash_mismatch//
CREATE TRIGGER trg_flag_hash_mismatch
BEFORE UPDATE ON Integrity_Audit
FOR EACH ROW
BEGIN
    DECLARE stored_hash TEXT;

    SELECT ev.hash_value INTO stored_hash
    FROM Evidence_Version ev
    WHERE ev.version_id = NEW.version_id
    LIMIT 1;

    IF stored_hash IS NOT NULL AND NEW.verified_hash != stored_hash THEN
        SET NEW.result = 'FAIL';
    ELSEIF stored_hash IS NOT NULL AND NEW.verified_hash = stored_hash THEN
        SET NEW.result = 'PASS';
    END IF;
END//
DELIMITER ;

-- 4. trg_prevent_evidence_delete
--    BEFORE DELETE on Evidence
--    Checks if any Custody_Event exists for any version of that evidence
DELIMITER //
DROP TRIGGER IF EXISTS trg_prevent_evidence_delete//
CREATE TRIGGER trg_prevent_evidence_delete
BEFORE DELETE ON Evidence
FOR EACH ROW
BEGIN
    DECLARE custody_count INT;

    SELECT COUNT(*) INTO custody_count
    FROM Custody_Event ce
    JOIN Evidence_Version ev ON ce.version_id = ev.version_id
    WHERE ev.evidence_id = OLD.evidence_id;

    IF custody_count > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'CANNOT DELETE: This evidence has custody events in its chain of custody. Deletion is prohibited to preserve forensic integrity.';
    END IF;
END//
DELIMITER ;
