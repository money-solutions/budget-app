const queryDB = require('./db');

async function createBudget(userID, budgetYear, budgetMonth) {    
    const query = 'INSERT INTO Budgets (BudgetYear, BudgetMonth, UserID) VALUES ($1, $2, $3)';
    const { rowCount } = await queryDB(query, [userID, budgetYear, budgetMonth]);
    return rowCount === 1;
}