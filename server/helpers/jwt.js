const jwt = require("jsonwebtoken")
const secret = process.env.SECRET

function signToken(payloads) {
    return jwt.sign(payloads, secret)
}

function verifyToken(token) {
    return jwt.verify(token, secret)
}

module.exports = { signToken, verifyToken }