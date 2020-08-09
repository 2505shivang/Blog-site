var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user"),
    middleware  = require("../middleware/index");

//root route
router.get("/", function (req, res) {
  res.render("landing");
});

// show signup form
router.get("/signup", function (req, res) {
  res.render("signup");
});

//handle sign up logic
router.post("/signup", function (req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render("signuperror", {error:err});
    }
    passport.authenticate("local")(req, res, function () {
      res.redirect("/blogs");
    });
  });
});

//show login form
router.get("/login", function (req, res) {
  res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/blogs",
    failureRedirect: "/signup",
  }), function (req, res) {
  });

// logout route
router.get("/logout", middleware.isLoggedIn, function (req, res) {
  req.logout();
  res.redirect("/blogs");
});

module.exports = router;