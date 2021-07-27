const {gql, ApolloError } = require ('apollo-server')
const {instanceUsers} = require ('../axios')
const Redis = require('ioredis')
const redis = new Redis()

const typeDef = gql`
  type Register {
    acknowledged: String,
    insertedId: ID
  }
  type Login {
    access_token: String
  }
  type GoogleLogin {
    access_token: String
  }
  extend type Query {
    loginpage: Login
    registerpage: Register
    googlepage: GoogleLogin
  }
  extend type Mutation {
    register(register: Formulir): Register
    login(login: Formulir): Login
    googlelogin(idToken: Token): GoogleLogin
  }
  input Formulir {
    email: String!
    password: String!
  }
  input Token {
    id_token: String!
  }
`
const resolvers = {
  Mutation: {
    register: async (parent, args, context, info) => {
      try {
        const data = {
          email: args.register.email,
          password: args.register.password
        }
        const res = await instanceUsers.post('/register', data)
        const output = await res.data
        redis.del('Register')
        return output
        
      } catch (err) {
        throw new ApolloError('status: 500 - Internal Server Error')
      }
    },
    login: async (parent, args, context, info) => {
      try {
        const data = {
          email: args.login.email,
          password: args.login.password
        }
        const res = await instanceUsers.post('/login', data)
        const output = await res.data
        redis.del('Login')
        return output
        
      } catch (err) {
        throw new ApolloError('status: 500 - Internal Server Error')
      }
    },
    googlelogin: async (parent, args, context, info) => {
      try {
        const data = {
          id_token: args.idToken.id_token
        }
        const res = await instanceUsers.put(`/googlelogin`, data)
        const output = await res.data
        redis.del('GoogleLogin')
        return output
        
      } catch (err) {
        throw new ApolloError('status: 500 - Internal Server Error')
      }
    }
  }
}
 
module.exports = { typeDef, resolvers }
