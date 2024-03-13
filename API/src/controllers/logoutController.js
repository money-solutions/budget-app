const session = require('express-session');
const sendResponse200 = require('../utils/sendResponse200');

const logout = async (req, res) => {
    const sessionID = req.sessionID
    const sessionData = req.sessionData

    console.log("in the  logout")
    console.log(sessionID);
    console.log(sessionData)
    
    try {
        await new Promise((resolve, reject) => {
          req.sessionStore.destroy(sessionID, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
        sendResponse200(res, "Session ended.");
      } catch (err) {
        console.error('Error destroying session:', err);
        res.status(500).send('Error destroying session.');
      }
  };
  
module.exports = { logout };