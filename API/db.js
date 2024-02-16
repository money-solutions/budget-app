const { Pool } = require('pg');

const pool = new Pool({
    user: 'Johnny',
    password: '',
    host: 'localhost',
    port: 5432,
    database: 'Johnny'
});

module.exports = {
    query: (text, params) => pool.query(text, params)
};