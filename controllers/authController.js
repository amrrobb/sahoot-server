const Kahoot = require('../models/kahoot')
const { comparePassword } = require('../helpers/bcrypt')
const {generateJWT} = require('../helpers/jwt')
const {OAuth2Client} = require('google-auth-library')

class AuthController {
  // static async findAll(req, res) {
  //   try {
  //     const kahoot = await Kahoot.findAll()
  //     res.json(kahoot)
  //   } catch (err) {
  //     err.response.data ? res.status(400).json({ msg: err.response.data }) : res.status(500).json({ error: err })
  //   }
  // }
  static async register(req, res, next) {
    try {
      const { email, password } = req.body
      let errorInput = []
      !email && errorInput.push('email cannot be empty')
      !password && errorInput.push('password cannot be empty')
      
      if (errorInput.length) {
          next({code: 400, 'message': errorInput})
      }
      
      const name = email.split('@')[0]
      const input = { email, password, name }
      const output = await Kahoot.register(input)
      res.status(201).json(output)
    } catch (err) {
      next(err)
    }
  } 
  static async login(req, res, next) {
    try {
      const { email, password } = req.body

      Kahoot.login(email)
      .then (output => {
        if (output.email) {
          if (comparePassword(password, output.password)) {
            const userInfo = {
              email: output.email,
              name: output.name,
              id: output._id
            }
            const token = generateJWT(userInfo)
            req.headers.access_token = token
            res.status(200).json({ access_token: token })
          }
        }
      })
      .catch(err => {
        next({code: 400, message: ["Wrong email/password"]})
      })
    } catch (err) {
      // console.log(err);
      next(err)
    }
  }
  static async googlelogin(req, res, next) {
    try {
      let payload = null
      const token = req.body.id_token
      const client = new OAuth2Client(process.env.CLIENT_ID)
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
      })   
      payload = ticket.getPayload()
  
      const email = payload.email
      const output = await Kahoot.login(email)
      if (output) {
        const userInfo = {
          email: output.email,
          name: output.name,
          id: JSON.stringify(output._id)
        }
        const token = generateJWT(userInfo)
        req.headers.access_token = token
        res.status(200).json({ access_token: token })
      } else {
        const registration = {
          email: email,
          password: `Aa1@${payload.at_hash.split('_').join('').substring(0,5)}`,
          name: email.split('@')[0],
        }
        const output = await Kahoot.register(registration)
        const userInfo = {
          email: output.email,
          name: output.name,
          id: JSON.stringify(output._id)
        }
        const token = generateJWT(userInfo)
        req.headers.access_token = token
        res.status(200).json({ access_token: token })
      }
      
    } catch (err) {
      next(err)
    }
  }

}
module.exports = AuthController