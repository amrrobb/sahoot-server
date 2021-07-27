const app = require("../app.js");
const { connect } = require("../config/mongodb")

const port = process.env.PORT || 4001 

connect()
    .then(async database => {

        app.listen(port, () => {
            console.log(`listening app at http://localhost:${port}`);
        })
    })
    .catch(err => {
        console.log(err);
    })
