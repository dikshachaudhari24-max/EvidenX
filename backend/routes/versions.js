const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const { v4: uuidv4 } = require('uuid');

// GET / — get all versions
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT ev.*, e.description AS evidence_description, e.case_id 
       FROM Evidence_Version ev
       JOIN Evidence e ON ev.evidence_id = e.evidence_id
       ORDER BY ev.version_time DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /api/versions error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /evidence/:evidenceId — get all versions for an evidence item
router.get('/evidence/:evidenceId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Evidence_Version WHERE evidence_id = ? ORDER BY version_number ASC',
      [req.params.evidenceId]
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /api/versions/evidence/:evidenceId error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST / — create new version (fires trg_auto_audit_on_version_insert)
router.post('/', async (req, res) => {
  try {
    const { evidence_id, hash_value, notes } = req.body;

    if (!evidence_id) {
      return res.status(400).json({ error: 'evidence_id is required' });
    }
    if (!hash_value) {
      return res.status(400).json({ error: 'hash_value is required' });
    }

    // Get next version number
    const [maxVersion] = await pool.query(
      'SELECT COALESCE(MAX(version_number), 0) AS max_ver FROM Evidence_Version WHERE evidence_id = ?',
      [evidence_id]
    );
    const nextVersionNumber = maxVersion[0].max_ver + 1;

    const version_id = uuidv4();
    const version_time = new Date();

    await pool.query(
      `INSERT INTO Evidence_Version (version_id, evidence_id, version_number, hash_value, version_time, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [version_id, evidence_id, nextVersionNumber, hash_value, version_time, notes || null]
    );

    const [created] = await pool.query('SELECT * FROM Evidence_Version WHERE version_id = ?', [version_id]);
    res.status(201).json(created[0]);
  } catch (err) {
    console.error('POST /api/versions error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /:id — update a version's notes
router.put('/:id', async (req, res) => {
  try {
    const { notes } = req.body;
    await pool.query(
      'UPDATE Evidence_Version SET notes = ? WHERE version_id = ?',
      [notes || null, req.params.id]
    );
    res.json({ message: 'Version updated successfully' });
  } catch (err) {
    console.error('PUT /api/versions/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /:id — delete a version
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM Evidence_Version WHERE version_id = ?', [req.params.id]);
    res.json({ message: 'Version deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/versions/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
