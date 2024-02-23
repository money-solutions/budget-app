const queryDB = require('../services/db');

async function createUser(username, password, firstname, lastname) {
  const query = 'INSERT INTO Users (username, password, firstname, lastname) VALUES ($1, $2, $3, $4)';
  const { rows } = await queryDB(query, [username, password, firstname, lastname]);
  return rows.length === 1;
}

async function checkIfUserExists(username) {
  const query = 'SELECT * FROM Users WHERE username = $1';
  const { rows } = await queryDB(query, [username]);
  return rows.length === 0;
}

async function authenticateUser(username, password) {
    const query = 'SELECT * FROM Users WHERE Username = $1 AND Password = $2';
    const { rows } = await queryDB(query, [username, password]);
    return rows.length === 1;
}

module.exports = {
  createUser,
  checkIfUserExists,
  authenticateUser,
};
