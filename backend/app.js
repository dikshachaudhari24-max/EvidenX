require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/evidence', require('./routes/evidence'));
app.use('/api/versions', require('./routes/versions'));
app.use('/api/custody',  require('./routes/custody'));
app.use('/api/accesslog', require('./routes/accesslog'));
app.use('/api/actors',   require('./routes/actors'));
app.use('/api/audit',    require('./routes/audit'));
app.use('/api/views',    require('./routes/views'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`EvidenX API running on http://localhost:${PORT}`);
});
