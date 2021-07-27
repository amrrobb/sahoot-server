const { MongoClient, ObjectId } = require('mongodb')
// Connection URL
// const url = 'mongodb+srv://admin:Admin123@server-movies.rrpd0.mongodb.net/entertainme'
const url = 'mongodb://localhost:27017'
let db = null

async function connect() {
    const client = new MongoClient(url)
    const environment = process.env.NODE_ENV
    const dbName = environment === 'test' ? 'ambislah_testing' : 'ambislah'

    await client.connect()
    console.log('Connected successfully to server with '+ dbName)
        
    const database = client.db(dbName)
    db = database

    return {database, client}
} 

function getDatabase () {
    return db
}

module.exports = {
    connect,
    getDatabase,
    ObjectId
}