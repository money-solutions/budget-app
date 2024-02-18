const { Pool } = require('pg');
const dbConfig = require('../configs/db.config');

const pool = new Pool(dbConfig);

// Function to send a query to the database
async function queryDB(text, params) {
    const start = Date.now();
    const client = await pool.connect();
    try {
        const result = await client.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query:', { text, duration, rows: result.rowCount });
        return result.rows;
    } finally {
        client.release();
    }
}

module.exports = queryDB;