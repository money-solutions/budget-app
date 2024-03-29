const queryDB = require('./db');

async function createAccount(nickname, bank, accountType, userId) {    
    const query = 'INSERT INTO Account (nickname, bank, accountType, userId) VALUES ($1, $2, $3, $4)';
    const { rowCount } = await queryDB(query, [nickname, bank, accountType, userId]);
    return rowCount === 1;
}

async function returnAccounts(userId) {
  const query = 'SELECT * FROM Account WHERE UserID = $1';
  const { rows } = await queryDB(query, [userId]);
  return rows
}

async function deleteAccount(accountId, userId) {
  const query = 'DELETE FROM Account WHERE AccountID = $1 AND UserID = $2';
  const result = await queryDB(query, [accountId, userId]);
  return result;
}

module.exports = {
    createAccount,
    returnAccounts,
    deleteAccount
};