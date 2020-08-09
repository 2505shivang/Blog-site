var express             = require("express")
  app                   = express(),
  bodyParser            = require("body-parser"),
  mongoose              = require("mongoose"),
  passport              = require("passport"),
  LocalStrategy         = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  methodOverride        = require("method-override"),
  expressSanitizer      = require("express-sanitizer"),
  User                  = require("./models/user"),
  blogs                 = require("./models/blog.js"),
  commentRoutes         = require("./routes/comments"),
  blogRoutes            = require("./routes/blogs"),
  indexRoutes           = require("./routes/index");;


  const { request } = require("express");

//Database connection
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
    secret: "Secret is secret",
    resave: false,
    saveUninitialized: false,
  })
);

//Passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  //   res.locals.error = req.flash("error");
  //   res.locals.success = req.flash("success");
  next();
});


//Routs 
app.use("/", indexRoutes);
app.use("/blogs", blogRoutes);
app.use("/blogs/:id/comments", commentRoutes);


//server start
app.listen(3000, process.env.IP, function () {
  console.log("server Started!!!");
});
