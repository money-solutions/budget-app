const bcrypt = require('bcrypt');

async function comparePasswords(userPassword, storedHashedPassword) {
    return await bcrypt.compare(userPassword, storedHashedPassword);
}

module.exports = comparePasswords;