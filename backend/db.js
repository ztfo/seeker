const { Pool } = require('pg');

const pool = new Pool({
    user: 'luispalomares',
    host: 'localhost',
    database: 'seekersql',
    password: 'password',
    port: 5432,
});

module.exports = pool;