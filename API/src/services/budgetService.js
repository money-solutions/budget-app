const queryDB = require("./db");

async function createBudget(userID, budgetYear, budgetMonth) {
    const query = "INSERT INTO Budgets (UserID, BudgetYear, BudgetMonth) VALUES ($1, $2, $3)";
    const { rowCount } = await queryDB(query, [userID, budgetYear, budgetMonth]);
    return rowCount === 1;
}

async function isBudgetUnique(userID, budgetYear) {
    const query = "SELECT * FROM Budgets WHERE UserID = $1 AND BudgetYear = $2";
    const { rows } = await queryDB(query, [userID, budgetYear]);
    return rows.length === 0;
}

module.exports = {
    createBudget,
    isBudgetUnique,
};
