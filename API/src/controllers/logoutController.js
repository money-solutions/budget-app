const sendResponse200 = require("../utils/sendResponse200");

const logout = async (req, res) => {
    const sessionID = req.sessionID;

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

        // Clear the old Session cookie in the client
        res.clearCookie('connect.sid', { path: '/' });
        
        sendResponse200(res, "Session ended.");
    } catch (err) {
        console.error("Error destroying session:", err);
        res.status(500).send("Error destroying session.");
    }
};

module.exports = { logout };
