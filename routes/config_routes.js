const indexR = require("./index")
const usersR = require("./users")
const cakesR = require("./cakes")
const countriesR = require("./countries")

exports.routInit=(app)=>{
    app.use("/", indexR)
    app.use("/users", usersR)
    app.use("/cakes", cakesR)
    app.use("/countries", countriesR)
}