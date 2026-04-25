const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// GET /evidence-summary — runs vw_evidence_summary
router.get('/evidence-summary', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vw_evidence_summary');
    res.json(rows);
  } catch (err) {
    console.error('GET /api/views/evidence-summary error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /custody-chain — runs vw_custody_chain
router.get('/custody-chain', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vw_custody_chain');
    res.json(rows);
  } catch (err) {
    console.error('GET /api/views/custody-chain error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /integrity-status — runs vw_integrity_status
router.get('/integrity-status', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vw_integrity_status');
    res.json(rows);
  } catch (err) {
    console.error('GET /api/views/integrity-status error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
