const db = require('../services/db');

const getAllUsers = (req, res) => {
    users = {
        "Name": "Robert Malloy",
        "Age": 21
    };
    res.json(users);
};

const getUserById = (req, res) => {

};

const login = (req, res) => {

};

const createUser = (req, res) => {

};

const deleteUser = (req, res) => {

};

module.exports = {
    getAllUsers,
    getUserById,
    login,
    createUser,
    deleteUser
};