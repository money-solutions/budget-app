const { createCategory, isCategoryUnique } = require("../services/categoryService");
const { getBudgetID } = require("../services/budgetService");
const sendResponse200 = require("../utils/sendResponse200");

const categoryCreate = async (req, res) => {
    const userID = req.session.user;
    const { budgetYear, budgetMonths, categoryName, categoryType, budgetAmount } = req.body;

    if (!budgetYear || budgetMonths || !categoryName || !categoryType || !budgetAmount) {
        return res.status(400).json({ message: "Missing parameters." });
    }

    const budgetIDs = await Promise.all(budgetMonths.map(async (month) => await getBudgetID(userID, budgetYear, month)));
    console.log(budgetIDs);

    // Ensure User does not already have budgets for the requested year
    for (let budgetID of budgetIDs) {
        const isUnique = await isCategoryUnique(userID, budgetID, categoryName);
        if (isUnique) {
            // Create budgets for each month of the requested year
            const isCategoryCreated = await createCategory(userID, budgetID, categoryName, categoryType, budgetAmount);
            if (!isCategoryCreated) {
                res.status(500).json({ message: "Database Server Error." });
            }
        } 
    }
    sendResponse200(res, "Categories successfully created.");
};

module.exports = { categoryCreate };
