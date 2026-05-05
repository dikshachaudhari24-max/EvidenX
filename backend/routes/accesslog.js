const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// GET / — get all access logs
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT al.*, ev.evidence_id, ev.version_number,
              e.description AS evidence_description, e.case_id
       FROM Access_Log al
       JOIN Evidence_Version ev ON al.version_id = ev.version_id
       JOIN Evidence e ON ev.evidence_id = e.evidence_id
       ORDER BY al.access_time DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /api/accesslog error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /version/:versionId — get access logs for a specific version
router.get('/version/:versionId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT al.*, ev.evidence_id, ev.version_number,
              e.description AS evidence_description
       FROM Access_Log al
       JOIN Evidence_Version ev ON al.version_id = ev.version_id
       JOIN Evidence e ON ev.evidence_id = e.evidence_id
       WHERE al.version_id = ?
       ORDER BY al.access_time DESC`,
      [req.params.versionId]
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /api/accesslog/version/:versionId error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST / — manually create access log entry
router.post('/', async (req, res) => {
  try {
    const { version_id, action_type } = req.body;
    if (!version_id || !action_type) {
      return res.status(400).json({ error: 'version_id and action_type are required' });
    }
    const { v4: uuidv4 } = require('uuid');
    const log_id = uuidv4();
    const access_time = new Date();
    await pool.query(
      'INSERT INTO Access_Log (log_id, version_id, access_time, action_type) VALUES (?, ?, ?, ?)',
      [log_id, version_id, access_time, action_type]
    );
    res.status(201).json({ log_id, version_id, access_time, action_type });
  } catch (err) {
    console.error('POST /api/accesslog error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /:id — update access log entry
router.put('/:id', async (req, res) => {
  try {
    const { action_type } = req.body;
    await pool.query(
      'UPDATE Access_Log SET action_type = COALESCE(?, action_type) WHERE log_id = ?',
      [action_type, req.params.id]
    );
    res.json({ message: 'Access log updated successfully' });
  } catch (err) {
    console.error('PUT /api/accesslog/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /:id — delete a single log entry
router.delete('/:id', async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM Access_Log WHERE log_id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Access log entry not found' });
    }

    await pool.query('DELETE FROM Access_Log WHERE log_id = ?', [req.params.id]);
    res.json({ message: 'Access log entry deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/accesslog/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
