var mongoose = require("mongoose"),
    Comment = require("./comment"),
    user = require("./user");

var blogSchema = mongoose.Schema({
    Author: String,
    image: String,
    title: String,
    content : String,
    user_id: { 
        type : mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    comments : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }] 
});

var blog = mongoose.model('blog' , blogSchema);
module.exports = blog;