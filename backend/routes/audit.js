const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const { v4: uuidv4 } = require('uuid');

// GET / — get all audit records with evidence description joined
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT ia.*, e.description AS evidence_description, e.case_id,
              ev.version_number, ev.hash_value AS stored_hash
       FROM Integrity_Audit ia
       JOIN Evidence e ON ia.evidence_id = e.evidence_id
       JOIN Evidence_Version ev ON ia.version_id = ev.version_id
       ORDER BY ia.audit_time DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /api/audit error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /evidence/:evidenceId — get audit history for one evidence item
router.get('/evidence/:evidenceId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT ia.*, e.description AS evidence_description,
              ev.version_number, ev.hash_value AS stored_hash
       FROM Integrity_Audit ia
       JOIN Evidence e ON ia.evidence_id = e.evidence_id
       JOIN Evidence_Version ev ON ia.version_id = ev.version_id
       WHERE ia.evidence_id = ?
       ORDER BY ia.audit_time DESC`,
      [req.params.evidenceId]
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /api/audit/evidence/:evidenceId error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST / — manually create an audit record
router.post('/', async (req, res) => {
  try {
    const { evidence_id, version_id, verified_hash, result } = req.body;
    if (!evidence_id || !version_id || !result) {
      return res.status(400).json({ error: 'evidence_id, version_id, and result are required' });
    }
    const audit_id = uuidv4();
    const audit_time = new Date();
    await pool.query(
      `INSERT INTO Integrity_Audit (audit_id, evidence_id, version_id, verified_hash, audit_time, result)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [audit_id, evidence_id, version_id, verified_hash || null, audit_time, result]
    );
    res.status(201).json({ audit_id, evidence_id, version_id, result });
  } catch (err) {
    console.error('POST /api/audit error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /run — trigger an audit check with expected hash
router.post('/run', async (req, res) => {
  try {
    const { evidence_id, expected_hash } = req.body;

    if (!evidence_id) {
      return res.status(400).json({ error: 'evidence_id is required' });
    }
    if (!expected_hash) {
      return res.status(400).json({ error: 'expected_hash is required' });
    }

    // Get latest version for this evidence
    const [latestVersion] = await pool.query(
      `SELECT * FROM Evidence_Version WHERE evidence_id = ? ORDER BY version_number DESC LIMIT 1`,
      [evidence_id]
    );

    if (latestVersion.length === 0) {
      return res.status(404).json({ error: 'No versions found for this evidence' });
    }

    const version = latestVersion[0];
    const result = expected_hash === version.hash_value ? 'PASS' : 'FAIL';
    const audit_id = uuidv4();
    const audit_time = new Date();

    await pool.query(
      `INSERT INTO Integrity_Audit (audit_id, evidence_id, version_id, verified_hash, audit_time, result)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [audit_id, evidence_id, version.version_id, expected_hash, audit_time, result]
    );

    res.status(201).json({
      audit_id,
      evidence_id,
      version_id: version.version_id,
      stored_hash: version.hash_value,
      verified_hash: expected_hash,
      result,
      audit_time,
    });
  } catch (err) {
    console.error('POST /api/audit/run error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /batch — run audit across all evidence
router.post('/batch', async (req, res) => {
  try {
    // Get the latest version for each evidence
    const [latestVersions] = await pool.query(
      `SELECT ev.*, e.description AS evidence_description
       FROM Evidence_Version ev
       JOIN Evidence e ON ev.evidence_id = e.evidence_id
       WHERE ev.version_number = (
         SELECT MAX(ev2.version_number)
         FROM Evidence_Version ev2
         WHERE ev2.evidence_id = ev.evidence_id
       )`
    );

    let passCount = 0;
    let failCount = 0;
    const failedEvidenceIds = [];
    const results = [];

    for (const version of latestVersions) {
      // Get the most recent audit for this evidence
      const [lastAudit] = await pool.query(
        `SELECT verified_hash FROM Integrity_Audit
         WHERE evidence_id = ? ORDER BY audit_time DESC LIMIT 1`,
        [version.evidence_id]
      );

      const lastVerifiedHash = lastAudit.length > 0 ? lastAudit[0].verified_hash : version.hash_value;
      const result = lastVerifiedHash === version.hash_value ? 'PASS' : 'FAIL';

      // Insert a new audit record
      const audit_id = uuidv4();
      await pool.query(
        `INSERT INTO Integrity_Audit (audit_id, evidence_id, version_id, verified_hash, audit_time, result)
         VALUES (?, ?, ?, ?, NOW(), ?)`,
        [audit_id, version.evidence_id, version.version_id, lastVerifiedHash, result]
      );

      if (result === 'PASS') {
        passCount++;
      } else {
        failCount++;
        failedEvidenceIds.push(version.evidence_id);
      }

      results.push({
        evidence_id: version.evidence_id,
        description: version.evidence_description,
        result,
        stored_hash: version.hash_value,
        verified_hash: lastVerifiedHash,
      });
    }

    res.json({
      total: latestVersions.length,
      pass_count: passCount,
      fail_count: failCount,
      failed_evidence_ids: failedEvidenceIds,
      results,
    });
  } catch (err) {
    console.error('POST /api/audit/batch error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /:id — update an audit record manually
router.put('/:id', async (req, res) => {
  try {
    const { result, verified_hash } = req.body;
    await pool.query(
      'UPDATE Integrity_Audit SET result = COALESCE(?, result), verified_hash = COALESCE(?, verified_hash) WHERE audit_id = ?',
      [result, verified_hash, req.params.id]
    );
    res.json({ message: 'Audit record updated successfully' });
  } catch (err) {
    console.error('PUT /api/audit/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /:id — delete an audit record
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM Integrity_Audit WHERE audit_id = ?', [req.params.id]);
    res.json({ message: 'Audit record deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/audit/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
