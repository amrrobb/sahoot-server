const jwt = require('jsonwebtoken')

const generateJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_KEY)
}
const verifyJWT = (token) => {
  return jwt.verify(token, process.env.JWT_KEY)
}

module.exports = {generateJWT, verifyJWT}