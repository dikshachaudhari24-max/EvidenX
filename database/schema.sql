-- ============================================================
-- EvidenX — Forensic Evidence Management System
-- Database Schema — evidence_vault
-- ============================================================

DROP DATABASE IF EXISTS evidence_vault;
CREATE DATABASE evidence_vault CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE evidence_vault;

-- 1. Actor — personnel who interact with evidence
CREATE TABLE Actor (
    actor_id      VARCHAR(36)   NOT NULL,
    name          VARCHAR(255)  NOT NULL,
    role          VARCHAR(50)   NOT NULL,
    email         VARCHAR(255)  DEFAULT NULL,
    department    VARCHAR(255)  DEFAULT NULL,
    badge         VARCHAR(50)   DEFAULT NULL,
    PRIMARY KEY (actor_id)
) ENGINE=InnoDB;

-- 2. Evidence — the main evidence record
CREATE TABLE Evidence (
    evidence_id   VARCHAR(36)   NOT NULL,
    case_id       VARCHAR(100)  NOT NULL,
    description   TEXT,
    type          VARCHAR(100)  DEFAULT NULL,
    status        VARCHAR(20)   NOT NULL DEFAULT 'secured',
    location      VARCHAR(255)  DEFAULT NULL,
    size_bytes    BIGINT        DEFAULT 0,
    created_at    DATETIME      NOT NULL,
    PRIMARY KEY (evidence_id)
) ENGINE=InnoDB;

-- 3. Evidence_Version — versioned snapshots with hash values
CREATE TABLE Evidence_Version (
    version_id     VARCHAR(36)   NOT NULL,
    evidence_id    VARCHAR(36)   NOT NULL,
    version_number INT           NOT NULL,
    hash_value     TEXT          NOT NULL,
    version_time   DATETIME      NOT NULL,
    notes          TEXT,
    PRIMARY KEY (version_id),
    CONSTRAINT fk_version_evidence
        FOREIGN KEY (evidence_id) REFERENCES Evidence(evidence_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 4. Custody_Event — records of who accessed or moved an evidence version
CREATE TABLE Custody_Event (
    event_id      VARCHAR(36)   NOT NULL,
    version_id    VARCHAR(36)   NOT NULL,
    actor_id      VARCHAR(36)   NOT NULL,
    action_type   VARCHAR(50)   NOT NULL,
    location      VARCHAR(255)  DEFAULT NULL,
    notes         TEXT,
    event_time    DATETIME      NOT NULL,
    PRIMARY KEY (event_id),
    CONSTRAINT fk_custody_version
        FOREIGN KEY (version_id) REFERENCES Evidence_Version(version_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_custody_actor
        FOREIGN KEY (actor_id) REFERENCES Actor(actor_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 5. Access_Log — append-only log auto-created by trigger
CREATE TABLE Access_Log (
    log_id        VARCHAR(36)   NOT NULL,
    version_id    VARCHAR(36)   NOT NULL,
    access_time   DATETIME      NOT NULL,
    action_type   VARCHAR(50)   NOT NULL,
    PRIMARY KEY (log_id),
    CONSTRAINT fk_accesslog_version
        FOREIGN KEY (version_id) REFERENCES Evidence_Version(version_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 6. Integrity_Audit — cryptographic hash verification records
CREATE TABLE Integrity_Audit (
    audit_id      VARCHAR(36)   NOT NULL,
    evidence_id   VARCHAR(36)   NOT NULL,
    version_id    VARCHAR(36)   NOT NULL,
    verified_hash TEXT,
    audit_time    DATETIME      NOT NULL,
    result        VARCHAR(10)   DEFAULT NULL,
    PRIMARY KEY (audit_id),
    CONSTRAINT fk_audit_evidence
        FOREIGN KEY (evidence_id) REFERENCES Evidence(evidence_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_audit_version
        FOREIGN KEY (version_id) REFERENCES Evidence_Version(version_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
