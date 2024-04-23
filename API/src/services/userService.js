const queryDB = require("./db");
const hashPassword = require("../utils/hashPassword");
const comparePasswords = require("../utils/comparePasswords");

async function createUser(username, password, firstname, lastname) {
    const hashedPassword = await hashPassword(password);
    const query = "CALL create_user($1, $2, $3, $4)";
    return await queryDB(query, [username, hashedPassword, firstname, lastname]);
}

async function checkIfUserExists(username) {
    const query = "SELECT * FROM get_user_by_username($1)";
    const { rows } = await queryDB(query, [username]);
    return rows.length === 0;
}

async function authenticateUser(username, password) {
    const query = "SELECT * FROM get_user_by_username($1)";
    const { rows } = await queryDB(query, [username]);
    if (rows.length !== 1) {
        return false;
    }
    const hashedPassword = rows[0].password;
    const passwordsMatch = await comparePasswords(password, hashedPassword);
    return passwordsMatch ? rows[0].userid : false;
}

async function deleteUser(username) {
    const query = "DELETE FROM Users WHERE username = $1";
    const result = await queryDB(query, [username]);
    return result;
}

async function getUserID(username) {
    const query = "SELECT UserID FROM Users WHERE Username = $1";
    const { rows } = await queryDB(query, [username]);
    return rows.length === 1 ? rows[0].userid : false;
}

async function deleteUser(userID) {
    const query = "DELETE FROM Users WHERE UserID = $1";
    const { rowCount } = await queryDB(query, [userID]);
    return rowCount === 1;
}

async function updateUserById(userId, first, last, email, phone) {
    const query = "UPDATE Users SET FirstName = $1, LastName = $2, Email = $3, Phone = $4 WHERE UserId = $5";
    const { rowCount } = await queryDB(query, [first, last, email, phone, userId]);
    return rowCount === 1;
}

async function getUserById(userId) {
    const query = "SELECT * FROM Users WHERE userID = $1";
    const { rows } = await queryDB(query, [userId]);
    return rows.length === 1 ? rows[0] : false;
}

module.exports = {
    createUser,
    checkIfUserExists,
    authenticateUser,
    deleteUser,
    getUserID,
    updateUserById,
    getUserById
};
