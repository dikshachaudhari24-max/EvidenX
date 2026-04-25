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
