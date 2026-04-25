const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const { v4: uuidv4 } = require('uuid');

// GET / — get all actors
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*,
              (SELECT COUNT(*) FROM Custody_Event ce WHERE ce.actor_id = a.actor_id) AS event_count
       FROM Actor a ORDER BY a.name ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /api/actors error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /:id — get single actor with custody event count
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*,
              (SELECT COUNT(*) FROM Custody_Event ce WHERE ce.actor_id = a.actor_id) AS event_count
       FROM Actor a WHERE a.actor_id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Actor not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('GET /api/actors/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST / — create new actor
router.post('/', async (req, res) => {
  try {
    const { name, role, email, department, badge } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }
    if (!role) {
      return res.status(400).json({ error: 'role is required' });
    }

    const actor_id = uuidv4();

    await pool.query(
      `INSERT INTO Actor (actor_id, name, role, email, department, badge)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [actor_id, name, role, email || null, department || null, badge || null]
    );

    const [created] = await pool.query('SELECT * FROM Actor WHERE actor_id = ?', [actor_id]);
    res.status(201).json(created[0]);
  } catch (err) {
    console.error('POST /api/actors error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /:id — update actor name or role
router.put('/:id', async (req, res) => {
  try {
    const { name, role, email, department, badge } = req.body;
    const [existing] = await pool.query('SELECT * FROM Actor WHERE actor_id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Actor not found' });
    }

    await pool.query(
      `UPDATE Actor SET name = COALESCE(?, name),
                        role = COALESCE(?, role),
                        email = COALESCE(?, email),
                        department = COALESCE(?, department),
                        badge = COALESCE(?, badge)
       WHERE actor_id = ?`,
      [name, role, email, department, badge, req.params.id]
    );

    const [updated] = await pool.query('SELECT * FROM Actor WHERE actor_id = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (err) {
    console.error('PUT /api/actors/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /:id — delete actor
router.delete('/:id', async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM Actor WHERE actor_id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Actor not found' });
    }

    await pool.query('DELETE FROM Actor WHERE actor_id = ?', [req.params.id]);
    res.json({ message: 'Actor deleted successfully' });
  } catch (err) {
    // Handle FK constraint errors (actor referenced in custody events)
    if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.errno === 1451) {
      return res.status(400).json({ error: 'Cannot delete this actor because they have custody events associated with them.' });
    }
    console.error('DELETE /api/actors/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
