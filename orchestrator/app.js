const { ApolloServer} = require('apollo-server')
const schema = require('./schema')
const PORT = process.env.PORT || 4000
require('dotenv').config()
const {verifyJWT} = require('./helpers')

const server = new ApolloServer({
  schema, 
  cors: true,
  context: ({req, res}) => {
    let access_token = req.headers.authorization || ''
    let user = access_token  && verifyJWT(access_token) ? verifyJWT(access_token)  : ''
    return {
      access_token,
      user
    }
  }
});


// The `listen` method launches a web server.
server.listen({port: PORT}).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
