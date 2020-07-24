var mongoose = require("mongoose");
const blog = require("./blog") 


var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog",
    }],
});

var User = mongoose.model("User", userSchema);

module.exports = User;
