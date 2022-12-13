export { }

const client = require("../src/connection")
const express = require("express");
const bodyParser = require("body-parser");
const route = require("../src/route")
//const  mongoose  = require("mongoose");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', route)

app.listen(process.env.PORT || 3001, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3001))
})

client.connect()
    .then(() => console.log("Postgres is connected"))
    .catch((error: any) => console.log(error))



