const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const indexRouter = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL Pool Connection
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

// Make pool accessible inside routes
app.locals.pool = pool;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Use existing router
app.use('/', indexRouter);

// NEW API ROUTE → /employees
app.get('/employees', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
