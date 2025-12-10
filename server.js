const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Configuration
const pool = new Pool(
  process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  } : {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'tank_db',
    password: process.env.DB_PASSWORD || 'your_password',
    port: process.env.DB_PORT || 5432,
  }
);

// Test database connection
async function initializeDB() {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL connected successfully');
    client.release();
  } catch (err) {
    console.error('Error connecting to PostgreSQL:', err);
  }
}

// Routes
app.get('/api/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY created_date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/items', async (req, res) => {
  const { name, category = 'General' } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO items (name, category) VALUES ($1, $2) RETURNING *',
      [name, category]
    );
    res.status(201).json({ message: 'Item created successfully', item: result.rows[0] });
  } catch (err) {
    console.error('Error creating item:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category = 'General' } = req.body;
  try {
    const result = await pool.query(
      'UPDATE items SET name = $1, category = $2 WHERE id = $3 RETURNING *',
      [name, category, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item updated successfully', item: result.rows[0] });
  } catch (err) {
    console.error('Error updating item:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Participants Routes
app.get('/api/participants', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM participants ORDER BY created_date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching participants:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/participants', async (req, res) => {
  const { gameUsername, email, server, gameId, youtubeUsername } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO participants (game_username, email, server, game_id, youtube_username) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [gameUsername, email || null, server, gameId, youtubeUsername]
    );
    res.status(201).json({ message: 'Participant registered successfully', participant: result.rows[0] });
  } catch (err) {
    console.error('Error registering participant:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/participants/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as count FROM participants');
    res.json({ count: result.rows[0].count });
  } catch (err) {
    console.error('Error counting participants:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PostgreSQL function example
app.get('/api/items/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT get_items_count() as count');
    res.json({ count: result.rows[0].count });
  } catch (err) {
    console.error('Error calling PostgreSQL function:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeDB();
});