const { createAccount } = require('../services/accountService');

const addAccount = async (req, res) => {
    const { name, bank, type} = req.body;

    if (!name || !bank || !type) {
        return res.status(400).json({ message: 'Missing parameters' });
    }

    const userId = 1;
    console.log(`Creating Account: '${name}' for User: '${userId}'`);

    try {
        await createAccount(name, bank, type, userId);
        const message = "New Associated Account Created Successfully!";
        return res.status(200).json({message: message});
    } catch (error) {
        console.error('Error creating new account:', error);
        return res.status(500).json({ message: 'Not Found' });
    }
    };
  
module.exports = { addAccount };