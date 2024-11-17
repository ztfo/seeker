const express = require('express');
const pool = require('../db'); // Import the database connection
const router = express.Router();

// find edges
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM edges');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// gather
router.post('/', async (req, res) => {
    const { node_from, node_to, connection_type, risk_level } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO edges (node_from, node_to, connection_type, risk_level) VALUES ($1, $2, $3, $4) RETURNING *',
            [node_from, node_to, connection_type, risk_level]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;