const queryDB = require("./db");
const hashPassword = require("../utils/hashPassword");
const comparePasswords = require("../utils/comparePasswords");

async function createUser(username, password, firstname, lastname) {
    const hashedPassword = await hashPassword(password);
    const query = "INSERT INTO Users (Username, Password, Firstname, Lastname, DateCreated) VALUES ($1, $2, $3, $4, CURRENT_DATE)";
    const { rowCount } = await queryDB(query, [username, hashedPassword, firstname, lastname]);
    return rowCount === 1;
}

async function checkIfUserExists(username) {
    const query = "SELECT * FROM Users WHERE username = $1";
    const { rows } = await queryDB(query, [username]);
    return rows.length === 0;
}

async function authenticateUser(username, password) {
    const query = "SELECT * FROM Users WHERE Username = $1";
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

module.exports = {
    createUser,
    checkIfUserExists,
    authenticateUser,
    deleteUser,
    getUserID,
};
