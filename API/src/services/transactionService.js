const queryDB = require("./db");

async function getTransactionsByCategoryIDs(categoryIDs) {
    const query = "SELECT * FROM Transactions WHERE CategoryID = ANY($1)";
    const { rows } = await queryDB(query, [categoryIDs]);
    return rows;
}

async function getTransactionsByYear(userID, year) {
    const query = `SELECT TransactionID, Amount, Currency, Description, DatePosted, DateTransacted, CategoryID, Nickname 
                FROM Transactions NATURAL JOIN Accounts 
                WHERE UserID = $1 AND DATE_PART('year', DateTransacted) = $2 AND CategoryID IS NULL`;
    const { rows } = await queryDB(query, [userID, year]);
    return rows;
}

async function returnTransactions(userID) {
    const query = "SELECT * FROM Transactions NATURAL JOIN Accounts WHERE UserID = $1";
    const { rows } = await queryDB(query, [userID]);
    return rows.length !== 0 ? rows : false;
}

async function deleteTransaction(transactionId) {
    const query = "DELETE FROM Transactions Where TransactionID = $1";
    const { rowCount } = await queryDB(query, [transactionId]);
    return rowCount === 1;
} 

async function editTransaction(transactionId, accountId, description, amount, currency, dateTransacted) {
    const query = "UPDATE Transactions SET AccountId = $2, Description = $3, amount = $4, currency = $5, DateTransacted = $6 WHERE transactionId = $1";
    const { rowCount } = await queryDB(query, [transactionId, accountId, description, amount, currency, dateTransacted]);
    return rowCount === 1;
}

async function createTransaction(description, amount, currency, dateTransacted, account) {
    const query = "INSERT INTO Transactions (description, amount, currency, dateposted, datetransacted, accountid) VALUES ($1, $2, $3, CURRENT_DATE, $4, $5)";
    const { rowCount } = await queryDB(query, [description, amount, currency, dateTransacted, account]);
    return rowCount === 1;
}

module.exports = {
    getTransactionsByCategoryIDs,
    getTransactionsByYear,
    returnTransactions,
    deleteTransaction,
    editTransaction,
    createTransaction,
};
