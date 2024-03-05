const mongoose = require("mongoose") 
const schema = mongoose.Schema;
const fruits = new schema({
    name: String,
    image: String,
})
const fruit = mongoose.model("Fruits", fruits);
module.exports.fruit = fruit