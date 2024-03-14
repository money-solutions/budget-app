const { authenticateUser } = require("../services/userService");
const sendResponse200 = require("../utils/sendResponse200");

const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Missing parameters." });
    }

    console.log(
        `Login request made with input username: '${username}' and password: '${password}'`
    );

    try {
        // Query the database for the user with the given username and password
        const userID = await authenticateUser(username, password);

        if (userID) {
            // Authentication successful
            req.session.user = userID; // Store username in session
            sendResponse200(res, "Login successful!");
        } else {
            // Authentication unsuccessful
            return res.status(401).json({ message: "Invalid credentials." });
        }
    } catch (error) {
        console.error("Error authenticating user:", error);
        return res.status(500).json({ message: "Not Found." });
    }
};

module.exports = { login };
