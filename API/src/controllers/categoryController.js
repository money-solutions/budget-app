const { createCategory, isCategoryUnique } = require("../services/categoryService");
const { getBudgetID } = require("../services/budgetService");
const sendResponse200 = require("../utils/sendResponse200");

const categoryCreate = async (req, res) => {
    try {
        const userID = req.session.user;
        const { budgetYear, budgetMonths, categoryName, categoryType, budgetAmount } = req.body;

        if (!budgetYear || !budgetMonths || !categoryName || !categoryType || !budgetAmount) {
            return res.status(400).json({ message: "Missing parameters." });
        }

        const budgetIDs = (await Promise.all(budgetMonths.map(async (month) => await getBudgetID(userID, budgetYear, month)))).filter((budgetID) => budgetID !== false);

        if (budgetIDs.length === 0) {
            return res.status(400).json({ message: "No Budgets not found." });
        }

        let promises = [];
        for (let budgetID of budgetIDs) {
            const isUnique = await isCategoryUnique(budgetID, categoryName);
            if (isUnique) {
                // Create budgets for each month of the requested year
                const isCategoryCreated = await createCategory(budgetID, categoryName, categoryType, budgetAmount);
                promises.push(isCategoryCreated);
            }
        }

        await Promise.all(promises);
        sendResponse200(res, "Categories successfully created.");
    } catch (error) {
        console.log("AN ERROR OCCURRED:");
        console.log(error);
        res.status(500).json({ message: "An error occurred." });
    }
};

module.exports = { categoryCreate };
