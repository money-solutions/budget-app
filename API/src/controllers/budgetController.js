const { createBudget, isBudgetUnique, doesBudgetYearExist, getBudgets } = require("../services/budgetService");
const { getCategories } = require("../services/categoryService");
const { getTransactionsByCategoryIDs, getTransactionsByYear } = require("../services/transactionService");
const { BudgetResponseObject } = require("../classes/budgetResponseObject");
const sendResponse200 = require("../utils/sendResponse200");

const budgetCreate = async (req, res) => {
    try {
        const userID = req.session.user;
        const { budgetYear } = req.body;
        if (!budgetYear) {
            return res.status(400).json({ message: "Missing parameters." });
        }

        // Ensure User does not already have budgets for the requested year
        const isUnique = await isBudgetUnique(userID, budgetYear);

        if (isUnique) {
            // Create budgets for each month of the requested year
            for (let budgetMonth = 1; budgetMonth <= 12; budgetMonth++) {
                const isBudgetCreated = await createBudget(userID, budgetYear, budgetMonth);
                if (!isBudgetCreated) {
                    res.status(500).json({ message: "Database Server Error." });
                }
            }
            sendResponse200(res, "Budgets successfully created.");
        } else {
            return res.status(400).json({ message: "Budget already exists." });
        }
    } catch (error) {
        console.log("AN ERROR OCCURRED:");
        console.log(error);
        res.status(500).json({ message: "An error occurred." });
    }
};

const budgetGet = async (req, res) => {
    try {
        const userID = req.session.user;
        const { budgetYear } = req.body;

        if (!budgetYear) {
            return res.status(400).json({ message: "Missing parameters." });
        }

        const doesBudgetExist = await doesBudgetYearExist(userID, budgetYear);

        if (doesBudgetExist) {
            // 1. Get all budget tuples (ids, months, years) for the requested year
            const budgets = await getBudgets(userID, budgetYear);

            // 2. Get all categories for each budget id
            const categories = await getCategories(budgets.map((budget) => budget.budgetid));

            // 3. Get all transactions for each category
            const transactionsWithCategories = await getTransactionsByCategoryIDs(categories.map((category) => category.categoryid));

            // 4. Get all transactions without categories in the budget year
            const transactionsWithoutCategories = await getTransactionsByYear(userID, budgetYear);

            const budgetResponseObject = new BudgetResponseObject(budgetYear, budgets, categories, transactionsWithCategories, transactionsWithoutCategories);
            res.status(200).json({ message: "Budget returned successfully", data: budgetResponseObject.t0JSON()});
        } else {
            return res.status(400).json({ message: "Budget year does not exist." });
        }
    } catch (error) {
        console.log("AN ERROR OCCURRED:");
        console.log(error);
        res.status(500).json({ message: "An error occurred." });
    }
};
module.exports = { budgetCreate, budgetGet };
