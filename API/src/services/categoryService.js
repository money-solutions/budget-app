const queryDB = require("./db");

async function createCategory(budgetID, categoryName, categoryType, budgetAmount) {
    const query = "INSERT INTO Categories (BudgetID, CategoryName, CategoryType, BudgetAmount) VALUES ($1, $2, $3, $4)";
    const { rowCount } = await queryDB(query, [budgetID, categoryName, categoryType, budgetAmount]);
    return rowCount === 1;
}

async function isCategoryUnique(budgetID, categotyName) {
    const query = "SELECT * FROM Categories WHERE BudgetID = $1 AND CategoryName = $2";
    const { rows } = await queryDB(query, [budgetID, categotyName]);
    return rows.length === 0;
}

async function getCategories(budgetIDs) {
    const query = `SELECT BudgetID, CategoryID, CategoryName, CategoryType, BudgetAmount, (SELECT SUM(Amount) FROM Transactions WHERE CategoryID = Categories.CategoryID) AS ActualAmount   
                FROM Categories 
                WHERE BudgetID = ANY($1)
                ORDER BY BudgetID`;
    const { rows } = await queryDB(query, [budgetIDs]);
    return rows;
}

module.exports = {
    createCategory,
    isCategoryUnique,
    getCategories,
};
