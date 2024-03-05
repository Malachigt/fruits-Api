const mongoose = require("mongoose") 
const Schema = mongoose.Schema;
const user = new Schema({
    password: String,
    likedFruits: [{ type: Schema.Types.ObjectId, ref: 'Fruit'}],
    dislikedFruits: [{ type: Schema.Types.ObjectId, ref: 'Fruit'}],
    currentFruit: { type: Schema.Types.ObjectId, ref: 'Fruit'},
    userName: String

});
const User = mongoose.model("User", user);
module.exports.user = User