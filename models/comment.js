var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    User: String,
    text : String,
});

var comment = mongoose.model('comment' , commentSchema);
module.exports = comment;