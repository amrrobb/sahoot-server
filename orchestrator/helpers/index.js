const jwt = require('jsonwebtoken')

const generateJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_KEY)
}
const verifyJWT = (token) => {
  return jwt.verify(token, process.env.JWT_KEY)
}

const getUser = (token) => {
  let user = verifyJWT(token)
  if (user) {
    return user
  } else {
    return {
      id: '',
      email: ''
    }
  }
}

module.exports = {generateJWT, verifyJWT, getUser}