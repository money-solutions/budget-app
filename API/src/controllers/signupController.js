const queryDB = require('../services/db');
const { checkIfUserExists, createUser } = require('../services/userService');
const sendResponse200 = require('../utils/sendResponse200');

const signup = async (req, res) => {
    const { username, password, firstname, lastname } = req.body;

    if (!username || !password || !firstname || !lastname) {
        return res.status(400).json({ message: 'Missing parameters' });
    }

    console.log(`Signup request made with input username: '${username}'`);

    try {
        
        const isUsernameUnique = await checkIfUserExists(username);

        if (isUsernameUnique) {
            const isUserCreated = await createUser(username, password, firstname, lastname);
            if (isUserCreated) {
                // User Creation successful
                req.session.user = username; // Store username in session
                sendResponse200(res, 'Signup successful!')
            }
        } else {
            // Signup unsuccessful
            return res.status(401).json({ message: 'Invalid credentials. Username already in use.' });
        }
        
    } catch (error) {
        console.error('Error signing up user:', error);
        return res.status(500).json({ message: 'Not Found' });
    }
    };
  
module.exports = { signup };