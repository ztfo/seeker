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

app.get('/api/simulate', async (req, res) => {
    const { startNode } = req.query;

    if (!startNode) {
        return res.status(400).json({ error: 'Start node is required' });
    }

    try {
        // wink ;)
        const result = await pool.query(`
            WITH RECURSIVE bfs AS (
                SELECT
                    node_to AS node,
                    1 AS level,
                    ARRAY[node_from] AS path
                FROM edges
                WHERE node_from = $1

                UNION ALL

                SELECT
                    e.node_to,
                    b.level + 1,
                    path || e.node_to
                FROM bfs b
                JOIN edges e ON b.node = e.node_from
                WHERE NOT (e.node_to = ANY(path))
            )
            SELECT node, level, path FROM bfs;
        `, [startNode]);

        res.json(result.rows);
    } catch (err) {
        console.error('Error in BFS simulation:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

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