const { Pool } = require('pg');

const pool = new Pool({
    user: 'admin',
    password: 'admin',
    host: 'localhost',
    port: 5432,
    database: '[DATBASE NAME]'
});

module.exports = {
    query: (text, params) => pool.query(text, params)
};