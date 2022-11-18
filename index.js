const express = require("express");
const bodyParser = require("body-parser");
const route = require("../studentMgmt/route")
const  mongoose  = require("mongoose");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

mongoose.connect("mongodb+srv://Anjali-11:Krishna@cluster0.hhecqj7.mongodb.net/StudentMgmt", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


app.use('/', route)


app.listen(process.env.PORT || 3001, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3001))
});