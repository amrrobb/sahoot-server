const {verifyJWT} = require('../helpers/jwt') 
const User = require('../models/kahoot')

module.exports = (req, res, next) => {
  // console.log(req.headers.access_token);
  const token = req.headers.access_token
  if (token) {
    try {
      const payload = verifyJWT(token)
      const userInfo = {
        email: payload.email,
        name: payload.name,
        id: payload.id
      }

      User.findOne(userInfo.id)
      .then(user => {
          if (user) {
            req.user = userInfo
            next()
          } else next({code:401, message: [`invalid JWT`]})})
        .catch(err => next({code:500}))
    }
    catch(err) {next({code:401, message: [`token JWT not valid`]})}
  } else next({code:401, message: [`please Register...., and login`]})
}