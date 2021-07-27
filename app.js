
require('dotenv').config()
const express = require("express")
const app = express()
const cors = require('cors')
const port = process.env.PORT || 4001 


app.use(cors())

const router = require('./routes')

app.use(express.json())

app.use(express.urlencoded({
    extended: false
}))

app.use(router);


connect()
    .then(async database => {

        app.listen(port, () => {
            console.log(`listening app at http://localhost:${port}`);
        })
    })
    .catch(err => {
        console.log(err);
    })


module.exports = app


