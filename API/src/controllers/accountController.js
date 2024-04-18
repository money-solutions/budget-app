const { returnAccounts, createAccount, deleteAccount, editAccount, getAccount } = require("../services/accountService");
const generateRandomTransactions = require("../utils/generateTransactions");

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

        if (isAccountCreated) {
            const account = await getAccount(name, bank, type, userID);
            console.log(account);
            const accountID = account[0].accountid;
            generateRandomTransactions(accountID, 10);
        }

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

const accountDelete = async (req, res) => {
    try {
        const userID = req.session.user;
        const accountId = req.body.accountid;

        if (!accountId) {
            return res.status(400).json({ message: "Missing parameters" });
        }

        console.log(`Deleting Account Account: '${accountId}' for User: '${userID}'`);
        const isAccountDeleted = await deleteAccount(accountId);
        if (!isAccountDeleted) {
            return res.status(500).json({ message: "Database Server Error." });
        }
        const message = "Account Deleted Successfully!";
        return res.status(200).json({ message: message });
    } catch (error) {
        console.error("Error deleting account:", error);
        const message = `Not Found: ${accountId}`;
        return res.status(500).json({ message: message });
    }
};

const accountEdit = async (req, res) => {
    try {
        const userID = req.session.user;

        const accountId = req.body.accountid;
        const name = req.body.name;
        const bank = req.body.bank;
        const type = req.body.type;

        if (!accountId || !name || !bank || !type) {
            return res.status(400).json({ message: "Missing parameters" });
        }

        console.log(`Editing Account: '${name}' for User: '${userID}'`);
        const isAccountUpdated = await editAccount(accountId, name, bank, type);
        if (!isAccountUpdated) {
            return res.status(500).json({ message: "Database Server Error." });
        }
        const message = "Account Updated Successfully!";
        return res.status(200).json({ message: message });
    } catch (error) {
        console.error("Error Updating account:", error);
        return res.status(500).json({ message: "Not Found" });
    }
};

module.exports = { getAccounts, accountCreate, accountDelete, accountEdit };
