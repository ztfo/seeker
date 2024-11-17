const express = require('express');
const path = require('path');
const pool = require('./db'); 
const nodeRoutes = require('./routes/nodes'); 
const edgeRoutes = require('./routes/edges');

const app = express();
const port = 3000; 

app.use(express.json());

// api
app.use('/api/nodes', nodeRoutes);
app.use('/api/edges', edgeRoutes);

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/nodes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM nodes');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});