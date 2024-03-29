const { returnAccounts } = require('../services/accountService');

const getAccounts = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("NEED FIX FOR USERID")
        //return res.status(400).json({ message: 'Missing parameters' });
    }

    const testUserId = 1;
    console.log(`Fetching All Accounts Associated with User: ${testUserId}`);

    try {
        const accounts = await returnAccounts(testUserId);
        const message = "Retrieved Accounts Successfully!";
        return res.status(200).json({message: message, accounts: accounts});
    } catch (error) {
        console.error('Error retrieving accounts:', error);
        return res.status(500).json({ message: 'Not Found' });
    }
};
  
module.exports = { getAccounts };