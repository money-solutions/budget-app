const { createCategory, isCategoryUnique, getCategoriesByUser, editCategory, deleteCategory } = require("../services/categoryService");
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

const categoryGet = async (req, res) => {
    try {
        const userID = req.session.user;

        const categories = await getCategoriesByUser(userID);

        if (categories) {
            const categoriesMap = {};
            categories.forEach((category) => {
                const budgetMonth = category.budgetmonth < 10 ? `0${category.budgetmonth}` : String(category.budgetmonth);
                const key = `${String(category.budgetyear)}-${budgetMonth}`;
                const value = { categoryname: category.categoryname, categoryid: category.categoryid, categorytype: category.categorytype };

                if (categoriesMap[key]) {
                    categoriesMap[key].push(value);
                } else {
                    categoriesMap[key] = [value];
                }
            });
            console.log("Categories Retrieved Successfully!");
            return res.status(200).json({ message: "Retrieved Categories Successfully!", categoriesMap });
        } else {
            return res.status(204).json({ message: "No Categories Found!" });
        }
    } catch (error) {
        console.error("Error retrieving categories:", error);
        return res.status(500).json({ message: "Not Found" });
    }
};

const categoryEdit = async (req, res) => {
    try {
        const userID = req.session.user;

        const categoryID = req.body.categoryid;
        const categoryName = req.body.categoryname;
        const amount = req.body.amount;

        console.log(req.body);

        if (!categoryID || !categoryName || !amount) {
            return res.status(400).json({ message: "Missing parameters" });
        }

        console.log(`Editing Category: '${categoryName}' for User: '${userID}'`);
        const isCategoryUpdated = await editCategory(categoryID, categoryName, amount);
        if (!isCategoryUpdated) {
            return res.status(500).json({ message: "Database Server Error." });
        }
        const message = "Category Updated Successfully!";
        return res.status(200).json({ message: message });
    } catch (error) {
        console.error("Error Updating category:", error);
        return res.status(500).json({ message: "Not Found" });
    }
};

const categoryDelete = async (req, res) => {
    try {
        const userID = req.session.user;
        const categoryID = req.body.categoryid;

        if (!categoryID) {
            return res.status(400).json({ message: "Missing parameters" });
        }

        console.log(`Deleting Category: '${categoryID}' for User: '${userID}'`);
        const isCategoryDeleted = await deleteCategory(categoryID);
        if (!isCategoryDeleted) {
            return res.status(500).json({ message: "Database Server Error." });
        }
        const message = "Category Deleted Successfully!";
        return res.status(200).json({ message: message });
    } catch (error) {
        console.error("Error deleting category:", error);
        return res.status(500).json({ message: message });
    }
};
module.exports = { categoryCreate, categoryGet, categoryEdit, categoryDelete };
