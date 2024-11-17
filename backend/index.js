const express = require('express');
const app = express();
const port = 3000;
const pool = require('./db');

app.get('/nodes', async (req, res) => {
    const result = await pool.query('SELECT * FROM nodes');
    res.json(result.rows);
});

app.get('/', (req, res) => {
    res.send('SeekerSQL Backend is Running');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});