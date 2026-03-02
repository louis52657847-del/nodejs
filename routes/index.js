const express = require('express');
const path = require('path');
const router = express.Router();

// Root route
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

// NEW: Employees API route
router.get('/employees', async (req, res) => {
  try {
    const pool = req.app.locals.pool; // get PostgreSQL pool
    const result = await pool.query('SELECT * FROM employees');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
