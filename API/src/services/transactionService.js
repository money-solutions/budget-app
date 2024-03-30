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

module.exports = {
    getTransactionsByCategoryIDs,
    getTransactionsByYear,
};
