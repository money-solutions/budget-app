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

async function getBudgetID(userID, budgetYear, budgetMonth) {
    const query = "SELECT BudgetID FROM Budgets WHERE UserID = $1 AND BudgetYear = $2 AND BudgetMonth = $3";
    const { rows } = await queryDB(query, [userID, budgetYear, budgetMonth]);
    return rows.length !== 0 ? rows[0].budgetid : false;
}

async function doesBudgetYearExist(userID, budgetYear) {
    const query = "SELECT * FROM Budgets WHERE UserID = $1 AND BudgetYear = $2";
    const { rows } = await queryDB(query, [userID, budgetYear]);
    return rows.length > 0;
}

async function getBudgets(userID, budgetYear) {
    const query = "SELECT BudgetID, BudgetYear, BudgetMonth FROM Budgets WHERE UserID = $1 AND BudgetYear = $2 ORDER BY BudgetMonth";
    const { rows } = await queryDB(query, [userID, budgetYear]);
    return rows;
}

async function getBudgetYears(userID) {
    const query = "SELECT DISTINCT BudgetYear FROM Budgets WHERE UserID = $1";
    const { rows } = await queryDB(query, [userID]);
    return rows;
}

module.exports = {
    createBudget,
    isBudgetUnique,
    getBudgetID,
    doesBudgetYearExist,
    getBudgets,
    getBudgetYears,
};
