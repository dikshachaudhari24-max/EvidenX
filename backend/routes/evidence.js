const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const { v4: uuidv4 } = require('uuid');

// GET / — fetch all evidence records
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT e.*, 
              (SELECT COUNT(*) FROM Evidence_Version ev WHERE ev.evidence_id = e.evidence_id) AS version_count,
              (SELECT ev2.hash_value FROM Evidence_Version ev2 WHERE ev2.evidence_id = e.evidence_id ORDER BY ev2.version_number DESC LIMIT 1) AS latest_hash
       FROM Evidence e ORDER BY e.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /api/evidence error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /:id — fetch single evidence with all its versions
router.get('/:id', async (req, res) => {
  try {
    const [evidence] = await pool.query(
      'SELECT * FROM Evidence WHERE evidence_id = ?',
      [req.params.id]
    );
    if (evidence.length === 0) {
      return res.status(404).json({ error: 'Evidence not found' });
    }

    const [versions] = await pool.query(
      'SELECT * FROM Evidence_Version WHERE evidence_id = ? ORDER BY version_number ASC',
      [req.params.id]
    );

    res.json({ ...evidence[0], versions });
  } catch (err) {
    console.error('GET /api/evidence/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST / — create new evidence + initial version
router.post('/', async (req, res) => {
  try {
    const { case_id, description, type, status, location, size_bytes, hash_value } = req.body;

    if (!case_id) {
      return res.status(400).json({ error: 'case_id is required' });
    }
    if (!description) {
      return res.status(400).json({ error: 'description is required' });
    }

    const evidence_id = uuidv4();
    const created_at = new Date();

    await pool.query(
      `INSERT INTO Evidence (evidence_id, case_id, description, type, status, location, size_bytes, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [evidence_id, case_id, description, type || null, status || 'secured', location || null, size_bytes || 0, created_at]
    );

    // Create initial version if hash provided
    if (hash_value) {
      const version_id = uuidv4();
      await pool.query(
        `INSERT INTO Evidence_Version (version_id, evidence_id, version_number, hash_value, version_time, notes)
         VALUES (?, ?, 1, ?, ?, 'Initial intake hash')`,
        [version_id, evidence_id, hash_value, created_at]
      );
    }

    const [created] = await pool.query('SELECT * FROM Evidence WHERE evidence_id = ?', [evidence_id]);
    res.status(201).json(created[0]);
  } catch (err) {
    console.error('POST /api/evidence error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /:id — update description or status
router.put('/:id', async (req, res) => {
  try {
    const { description, status, location, type } = req.body;
    const [existing] = await pool.query('SELECT * FROM Evidence WHERE evidence_id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Evidence not found' });
    }

    await pool.query(
      `UPDATE Evidence SET description = COALESCE(?, description),
                           status = COALESCE(?, status),
                           location = COALESCE(?, location),
                           type = COALESCE(?, type)
       WHERE evidence_id = ?`,
      [description, status, location, type, req.params.id]
    );

    const [updated] = await pool.query('SELECT * FROM Evidence WHERE evidence_id = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (err) {
    console.error('PUT /api/evidence/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /:id — delete evidence (trigger may block it)
router.delete('/:id', async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM Evidence WHERE evidence_id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Evidence not found' });
    }

    await pool.query('DELETE FROM Evidence WHERE evidence_id = ?', [req.params.id]);
    res.json({ message: 'Evidence deleted successfully' });
  } catch (err) {
    // Handle trigger SQLSTATE 45000 errors
    if (err.sqlState === '45000' || (err.message && err.message.includes('CANNOT DELETE'))) {
      return res.status(400).json({ error: err.message });
    }
    console.error('DELETE /api/evidence/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
