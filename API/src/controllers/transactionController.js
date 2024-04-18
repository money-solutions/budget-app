const { returnTransactions } = require("../services/transactionService");
const { createTransaction } = require("../services/transactionService");
const { deleteTransaction } = require("../services/transactionService");
const { editTransaction } = require("../services/transactionService");

const getTransactions = async (req, res) => {
    try {
        const userID = req.session.user;
        console.log(userID);
        const transactions = await returnTransactions(userID);

        if (transactions) {
            console.log("Transactions Retrieved Successfully!");
            return res.status(200).json({ message: "Retrieved Transactions Successfully!", transactions });
        } else {
            return res.status(200).json({ message: "No Transactions Found!", transactions: [] });
        }
    } catch (error) {
        console.error("Error retrieving transactions:", error);
        return res.status(500).json({ message: "Not Found" });
    }
};

const transactionCreate = async (req, res) => {
    try {
        const userID = req.session.user;
        const description = req.body.description;
        const amount = req.body.amount;
        const currency = req.body.currency;
        const transactionDate = req.body.transactionDate;
        const accountid = req.body.accountid;
        const categoryid = req.body.category;
        
        if (!description || !amount || !currency || !transactionDate || !accountid) {
            return res.status(400).json({ message: "Missing parameters" });
        }

        console.log(`Creating Transaction: '${description}' for User: '${userID}'`);
        const isTransactionCreated = await createTransaction(description, amount, currency, transactionDate, accountid, categoryid);
        if (!isTransactionCreated) {
            return res.status(500).json({ message: "Database Server Error." });
        }
        const message = "New Associated Transaction Created Successfully!";
        return res.status(200).json({ message: message });
    } catch (error) {
        console.error("Error creating new transaction:", error);
        return res.status(500).json({ message: "Not Found" });
    }
};

const transactionDelete = async (req, res) => {
    try {
        const userID = req.session.user;
        const transactionId = req.body.transactionid;

        if (!transactionId) {
            return res.status(400).json({ message: "Missing parameters" });
        }

        console.log(`Deleting Transaction: '${transactionId}' for User: '${userID}'`);
        const isTransactionDeleted = await deleteTransaction(transactionId);
        if (!isTransactionDeleted) {
            return res.status(500).json({ message: "Database Server Error." });
        }
        const message = "Transaction Deleted Successfully!";
        return res.status(200).json({ message: message });
    } catch (error) {
        console.error("Error deleting transaction:", error);
        const message = `Not Found: ${transactionId}`;
        return res.status(500).json({ message: message });
    }
};

const transactionEdit = async (req, res) => {
    try {
        const userID = req.session.user;

        const transactionId = req.body.currentTransaction;
        const description = req.body.description;
        const amount = req.body.amount;
        const currency = req.body.currency;

        console.log(req.body);

        if (!transactionId || !description || !amount || !currency) {
            return res.status(400).json({ message: "Missing parameters" });
        }

        console.log(`Editing Transaction: '${description}' for User: '${userID}'`);
        const isTransactionUpdated = await editTransaction(transactionId, description, amount, currency);
        if (!isTransactionUpdated) {
            return res.status(500).json({ message: "Database Server Error." });
        }
        const message = "Transaction Updated Successfully!";
        return res.status(200).json({ message: message });
    } catch (error) {
        console.error("Error Updating transaction:", error);
        return res.status(500).json({ message: "Not Found" });
    }
};

module.exports = { getTransactions, transactionCreate, transactionDelete, transactionEdit };
