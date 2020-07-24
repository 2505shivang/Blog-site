var express = require("express"),
  bodyParser = require("body-parser"),
  User = require("./models/user"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose");

(methodOverride = require("method-override")),
  (expressSanitizer = require("express-sanitizer"));

//Models
var blogs = require("./models/blog.js");
const { request } = require("express");

var app = express();

//Connecting DataBase

mongoose
  .connect("mongodb://localhost:27017/blogs", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to DB!!"))
  .catch((error) => console.log(error.message));

//config
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

app.use(
  require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//================
//====ROUTES===
//=================
//landing page
app.get("/", function (req, res) {
  res.render("landing");
});

//blogs page
app.get("/blogs", isLoggedIn, function (req, res) {
  blogs.find({}, function (err, allblogs) {
    if (err) {
      console.log(err);
    } else {
      res.render("blogs", { blogs: allblogs });
    }
  });
});

//auth routes
//show sign up form
app.get("/register", function (req, res) {
  res.render("register");
});

//handling user sign up
app.post("/register", function (req, res) {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        return res.render("register");
      }
      passport.authenticate("local")(req, res, function () {
        res.redirect("/blogs");
      });
    }
  );
});

// LOGIN ROUTES
//render login form
app.get("/login", function (req, res) {
  res.render("login");
});
//login logic
//middleware
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/blogs",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

//crate new blog
app.post("/blogs", function (req, res) {
  blogs.create(req.body.blog, function (err, newblog) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/blogs");
    }
  });
});

//new blog form
app.get("/blogs/new", function (req, res) {
  res.render("NewBlog");
});

//show page
app.get("/blogs/:id", function (req, res) {
  blogs.findById(req.params.id, function (err, foundblog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("blog", { blog: foundblog });
    }
  });
});

//update
app.get("/blogs/:id/edit", function (req, res) {
  blogs.findById(req.params.id, function (err, foundblog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("editblog", { blog: foundblog });
    }
  });
});

app.put("/blogs/:id", function (req, res) {
  newData = req.body.blog;
  blogs.findByIdAndUpdate(req.params.id, newData, function (err, updatedblog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

//Delete
app.delete("/blogs/:id", function (req, res) {
  blogs.findByIdAndDelete(req.params.id, function (err) {
    if (err) {
      res.send(error);
    } else {
      res.redirect("/blogs");
    }
  });
});

//server start
app.listen(3000, process.env.IP, function () {
  console.log("server Started!!!");
});
