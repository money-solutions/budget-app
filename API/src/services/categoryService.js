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

async function getCategoriesByUser(userID) {
    const query = "Select CategoryID, CategoryName, BudgetYear, BudgetMonth from Categories NATURAL JOIN Budgets WHERE UserID = $1";
    const { rows } = await queryDB(query, [userID]);
    return rows;
}

async function editCategory(categoryID, categoryName, categoryAmount) {
    const query = "UPDATE Categories SET CategoryName = $2, BudgetAmount = $3 WHERE categoryID = $1";
    const { rowCount } = await queryDB(query, [categoryID, categoryName, categoryAmount]);
    return rowCount === 1;
}

async function deleteCategory(categoryID) {
    const query = "DELETE FROM Categories WHERE CategoryID = $1";
    const { rowCount } = await queryDB(query, [categoryID]);
    return rowCount === 1;
}

module.exports = {
    createCategory,
    isCategoryUnique,
    getCategories,
    getCategoriesByUser,
    editCategory,
    deleteCategory,
};
