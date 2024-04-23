function constructBudgets(budgets, categories, transactionsWithCategories) {
    return budgets.map((budget) => {
        const budgetYear = budget.budgetyear;
        const budgetMonth = budget.budgetmonth;
        const budgetCategories = categories.filter((category) => category.budgetid === budget.budgetid);
        const categoryIDs = budgetCategories.map((category) => category.categoryid);
        const transactions = transactionsWithCategories.filter((transaction) => categoryIDs.includes(transaction.categoryid));
        return {
            budgetYear: budgetYear,
            budgetMonth: budgetMonth,
            incomeCategories: budgetCategories
                .filter((category) => category.categorytype === "Income")
                .map((category) => {
                    category.transactions = transactions.filter((transaction) => transaction.categoryid === category.categoryid);
                    return category;
                }),
            expenseCategories: budgetCategories
                .filter((category) => category.categorytype === "Expense")
                .map((category) => {
                    category.transactions = transactions.filter((transaction) => transaction.categoryid === category.categoryid);
                    return category;
                }),
            transactions: transactions,
        };
    });
}

/*
meta : {
    budgetYear: 2020,
}

budgets : [
    {
        budgetyear: 2020,
        budgetmonth: 1,
        incomecategories: [
            {
                categoryid: 1,
                categoryname: "Food",
                categorytype: "Income",
                budgetamount: 1000
                actualamount: 1000
            },
        ],
        expensecategories: [
            {
                categoryid: 1,
                categoryname: "Food",
                categorytype: "Income",
                budgetamount: 1000
                actualamount: 1000
            },
        ],
        transactions: [
            {
                transactionid: 1,
                amount: 1000,
                currency: "USD",
                description: "Food",
                dateposted: "2020-01-01",
                datetransacted: "2020-01-01",
                categoryid: 1,
                nickname: "Nickname"
            }
        ]
    },
]
    
}
*/

class BudgetResponseObject {
    constructor(budgetYear, budgets, categories, transactionsWithCategories, transactionsWithoutCategories) {
        this.metadata = {
            budgetYear,
        };
        this.budgets = constructBudgets(budgets, categories, transactionsWithCategories);
        this.uncategorizedTransactions = transactionsWithoutCategories;
    }

    t0JSON() {
        return {
            metadata: this.metadata,
            budgets: this.budgets,
            uncategorizedTransactions: this.uncategorizedTransactions,
        };
    }
}

module.exports = { BudgetResponseObject };
