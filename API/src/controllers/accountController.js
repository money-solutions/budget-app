const { returnAccounts } = require("../services/accountService");
const { createAccount } = require("../services/accountService");

const getAccounts = async (req, res) => {
    try {
        const userID = req.session.user;
        const accounts = await returnAccounts(userID);

        if (accounts) {
            console.log("Accounts Retrieved Successfully!");
            return res.status(200).json({ message: "Retrieved Accounts Successfully!", accounts });
        } else {
            return res.status(200).json({ message: "No Accounts Found!", accounts: [] });
        }
    } catch (error) {
        console.error("Error retrieving accounts:", error);
        return res.status(500).json({ message: "Not Found" });
    }
};

const accountCreate = async (req, res) => {
    try {
        const userID = req.session.user;
        const { name, bank, type } = req.body;

        if (!name || !bank || !type) {
            return res.status(400).json({ message: "Missing parameters" });
        }

        console.log(`Creating Account: '${name}' for User: '${userID}'`);
        const isAccountCreated = await createAccount(name, bank, type, userID);
        if (!isAccountCreated) {
            return res.status(500).json({ message: "Database Server Error." });
        }
        const message = "New Associated Account Created Successfully!";
        return res.status(200).json({ message: message });
    } catch (error) {
        console.error("Error creating new account:", error);
        return res.status(500).json({ message: "Not Found" });
    }
};

module.exports = { getAccounts, accountCreate };
