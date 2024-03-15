const queryDB = require("./db");

async function createCategory(userID, budgetID, categoryName, categoryType, budgetAmount) {
    const query = "INSERT INTO Categories (UserID, BudgetID, CategoryName, CategoryType, BudgetAmount) VALUES ($1, $2, $3, $4, $5)";
    const { rowCount } = await queryDB(query, [userID, budgetID, categoryName, categoryType, budgetAmount]);
    return rowCount === 1;
}

async function isCategoryUnique(userID, budgetID, categotyName) {
    const query = "SELECT * FROM Budgets WHERE UserID = $1 AND BudgetID = $2 AND CategoryName = $3";
    const { rows } = await queryDB(query, [userID, budgetID, categotyName]);
    return rows.length === 0;
}

module.exports = {
    createCategory,
    isCategoryUnique,
};
