var mongoose = require("mongoose"),
    Comment = require("./comment");

var blogSchema = mongoose.Schema({
    Author: String,
    image: String,
    title: String,
    content : String,
    comments : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }] 
});

var blog = mongoose.model('blog' , blogSchema);
module.exports = blog;