const queryDB = require("./db");

async function createAccount(nickname, bank, accountType, userID) {
    const query = "INSERT INTO Accounts (nickname, bank, accountType, userId) VALUES ($1, $2, $3, $4)";
    const { rowCount } = await queryDB(query, [nickname, bank, accountType, userID]);
    return rowCount === 1;
}

async function returnAccounts(userID) {
    const query = "SELECT * FROM Accounts WHERE UserID = $1";
    const { rows } = await queryDB(query, [userID]);
    return rows.length !== 0 ? rows : false;
}

async function deleteAccount(accountId) {
    const query = "DELETE FROM Accounts Where AccountID = $1";
    const { rowCount } = await queryDB(query, [accountId]);
    return rowCount === 1;
} 

async function editAccount(accountId, nickname, bank, accountType) {
    const query = "UPDATE Accounts SET nickname = $2, bank = $3, accountType = $4 WHERE accountId = $1";
    const { rowCount } = await queryDB(query, [accountId, nickname, bank, accountType]);
    return rowCount === 1;
}

module.exports = {
    createAccount,
    returnAccounts,
    deleteAccount,
    editAccount,
};
