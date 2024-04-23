const { createTransaction } = require("../services/transactionService");

function getRandomDateInLastMonth() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const lastDayOfThisMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Get the last day of the last month

    // Generate a random day between 1 and the last day of the month
    const randomDay = Math.floor(Math.random() * lastDayOfThisMonth) + 1;

    // Create a new date object with the random day
    const randomDate = new Date(currentYear, currentMonth, randomDay);

    // Format the date as YYYY-MM-DD
    const sqlFormattedDate = randomDate.toISOString().split("T")[0];

    return sqlFormattedDate;
}

function createRandomTransaction(accountID) {
    const stores = [
        "Target",
        "Walmart",
        "Costco",
        "Chick-Fil-A",
        "Publix",
        "Macys",
        "Culvers",
        "Five Guys Burgers",
        "McDonalds",
        "Burger King",
        "Florida Power and Light",
        "Netflix",
        "Store",
    ];
    const amount = (-(Math.random() * (250 - 5) + 5).toFixed(2));
    const dateTransacted = getRandomDateInLastMonth();
    const currency = "USD";
    const description = `Purchase from ${stores[Math.floor(Math.random() * stores.length)]}`;

    return createTransaction(description, amount, currency, dateTransacted, accountID, null);
}

function generateRandomTransactions(accountID, numToGenerate) {
    for (let i = 0; i < numToGenerate; i++) {
        createRandomTransaction(accountID);
    }
    createTransaction("Job Paycheck", 950.34, "USD", getRandomDateInLastMonth(), accountID, null);
}

module.exports = generateRandomTransactions;
