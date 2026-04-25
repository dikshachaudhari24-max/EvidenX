const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const { v4: uuidv4 } = require('uuid');

// GET / — get all custody events with actor name and evidence info joined
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT ce.*, 
              a.name AS actor_name, a.role AS actor_role, a.badge AS actor_badge,
              a.email AS actor_email, a.department AS actor_department,
              ev.evidence_id, ev.version_number, ev.hash_value,
              e.description AS evidence_description, e.case_id
       FROM Custody_Event ce
       JOIN Actor a ON ce.actor_id = a.actor_id
       JOIN Evidence_Version ev ON ce.version_id = ev.version_id
       JOIN Evidence e ON ev.evidence_id = e.evidence_id
       ORDER BY ce.event_time DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /api/custody error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /evidence/:evidenceId — get full custody chain for one evidence item
router.get('/evidence/:evidenceId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM vw_custody_chain WHERE evidence_id = ? ORDER BY event_time DESC`,
      [req.params.evidenceId]
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /api/custody/evidence/:evidenceId error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST / — log new custody event (fires trg_log_access_on_custody_event)
router.post('/', async (req, res) => {
  try {
    const { evidence_id, actor_id, action_type, location, notes } = req.body;

    if (!evidence_id) {
      return res.status(400).json({ error: 'evidence_id is required' });
    }
    if (!actor_id) {
      return res.status(400).json({ error: 'actor_id is required' });
    }
    if (!action_type) {
      return res.status(400).json({ error: 'action_type is required' });
    }

    // Find the latest version for this evidence
    const [latestVersion] = await pool.query(
      'SELECT version_id FROM Evidence_Version WHERE evidence_id = ? ORDER BY version_number DESC LIMIT 1',
      [evidence_id]
    );

    if (latestVersion.length === 0) {
      return res.status(400).json({ error: 'No versions found for this evidence. Create a version first.' });
    }

    const version_id = latestVersion[0].version_id;
    const event_id = uuidv4();
    const event_time = new Date();

    await pool.query(
      `INSERT INTO Custody_Event (event_id, version_id, actor_id, action_type, location, notes, event_time)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [event_id, version_id, actor_id, action_type, location || null, notes || null, event_time]
    );

    const [created] = await pool.query(
      `SELECT ce.*, a.name AS actor_name, a.role AS actor_role, a.badge AS actor_badge
       FROM Custody_Event ce
       JOIN Actor a ON ce.actor_id = a.actor_id
       WHERE ce.event_id = ?`,
      [event_id]
    );
    res.status(201).json(created[0]);
  } catch (err) {
    console.error('POST /api/custody error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
