const { createBudget, isBudgetUnique } = require("../services/budgetService");
const sendResponse200 = require("../utils/sendResponse200");

const budgetCreate = async (req, res) => {
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
};

module.exports = { budgetCreate };
