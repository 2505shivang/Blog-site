var mongoose = require("mongoose");
passportLocalMongoose = require("passport-local-mongoose");

const blog = require("./blog");

var UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blog",
    },
  ],
});
UserSchema.plugin(passportLocalMongoose);
var User = mongoose.model("User", UserSchema);

module.exports = User;
