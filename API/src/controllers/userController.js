const { checkIfUserExists, createUser, getUserID, authenticateUser, deleteUser } = require("../services/userService");
const sendResponse200 = require("../utils/sendResponse200");

const userSignup = async (req, res) => {
    const { username, password, firstname, lastname } = req.body;

    if (!username || !password || !firstname || !lastname) {
        return res.status(400).json({ message: "Missing parameters" });
    }

    console.log(`Signup request made with input username: '${username}'`);

    try {
        const isUsernameUnique = await checkIfUserExists(username);

        if (isUsernameUnique) {
            const isUserCreated = await createUser(username, password, firstname, lastname);
            if (isUserCreated) {
                // Get userID to store in the session
                const userID = await getUserID(username);
                req.session.user = userID; // Store username in session
                sendResponse200(res, "Signup successful!");
            }
        } else {
            // Signup unsuccessful
            return res.status(401).json({
                message: "Invalid credentials. Username already in use.",
            });
        }
    } catch (error) {
        console.error("Error signing up user:", error);
        return res.status(500).json({ message: "Not Found" });
    }
};

const userLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Missing parameters." });
    }

    console.log(`Login request made with input username: '${username}' and password: '${password}'`);

    try {
        // Query the database for the user with the given username and password
        const userID = await authenticateUser(username, password);

        if (userID) {
            req.session.user = userID; // Store userID in session
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

const userLogout = async (req, res) => {
    const sessionID = req.sessionID;
    console.log(`Logging out user with ID: ${req.session.user}`);

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

        // Clear the old Session cookie in the client when the response is sent
        res.clearCookie("connect.sid", { path: "/" });

        sendResponse200(res, "Session ended.");
    } catch (err) {
        console.error("Error destroying session:", err);
        res.status(500).send("Error destroying session.");
    }
};

const userDelete = async (req, res) => {
    const userID = req.session.user;
    try {
        const isUserDeleted = await deleteUser(userID);
        if (isUserDeleted) {
            console.log(`User with ID: ${userID} deleted.`);
            sendResponse200(res, "User deleted.");
        } else {
            // Request invalid
            return res.status(401).json({ message: "Invalid request." });
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ message: "Not Found" });
    }

};

module.exports = { userSignup, userLogin, userLogout, userDelete };
