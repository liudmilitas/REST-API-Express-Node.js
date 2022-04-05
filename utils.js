// setting up utils.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Secret for securing JSON webtokens
const JWT_SECRET = "my-secret-phrase";

// Hash password to save in database

module.exports.hashPassword = (password) => {
    const hashValue = bcrypt.hashSync(password, 8)
    return hashValue
}

// Compare hashed password to the password from request

module.exports.comparePassword = (password, hash) => {
    const correct = bcrypt.compareSync(password, hash)
    return correct
}

// Create and sign JSON web token

module.exports.getJWTToken = (account) => {
    const userData = { userId: account.id, username: account.username }
    const accessToken = jwt.sign(userData, JWT_SECRET)
    return accessToken
}

// Verify signature of JSON webtoken

module.exports.verifyJWT = (token) => {
    return jwt.verify(token, JWT_SECRET)
}

// Get data from JSON webtoken

module.exports.decodeJWT = (token) => {
    return jwt.decode(token, JWT_SECRET)
}