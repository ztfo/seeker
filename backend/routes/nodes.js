const express = require('express');
const pool = require('../db');
const router = express.Router();

// find node
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM nodes');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// gather
router.post('/', async (req, res) => {
    const { name, type } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO nodes (name, type) VALUES ($1, $2) RETURNING *',
            [name, type]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;