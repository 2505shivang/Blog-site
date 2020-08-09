var mongoose = require("mongoose"),
    user = require("./user");

var commentSchema = new mongoose.Schema({
  text: String,
  user: String,
  user_id : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  }
});

var comment = mongoose.model("Comment", commentSchema);
module.exports = comment;
