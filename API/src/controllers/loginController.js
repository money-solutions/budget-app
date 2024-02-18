const queryDB = require('../services/db');
const sendResponse200 = require('../utils/sendResponse200');

const login = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Query the database for the user with the given username and password
      const query = 'SELECT * FROM Users WHERE Username = $1 AND Password = $2';
      const { rows } = await queryDB(query, [username, password]);
  
      if (rows.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Authentication successful
      req.session.user = username; // Store username in session
      sendResponse200(res, 'Login successful!')
    } catch (error) {
      console.error('Error authenticating user:', error);
      return res.status(500).json({ message: 'Invalid credentials' });
    }
  };
  
module.exports = { login };