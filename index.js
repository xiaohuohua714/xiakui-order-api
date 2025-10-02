const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'mysql2.sqlpub.com',
  port: 3307,
  user: 'xiakui',
  password: 'uagReUUZnMqkOSGi',
  database: 'xiakui'
});

app.get('/api/menu', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM menu');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/order', async (req, res) => {
  const { table, cart } = req.body;
  try {
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const [result] = await pool.query(
      'INSERT INTO orders (table_num, items, total) VALUES (?, ?, ?)',
      [table, JSON.stringify(cart), total]
    );
    res.json({ orderId: result.insertId, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 10000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
