var express = require("express");
var router = express.Router();
var Blog = require("../models/blog");
var middleware = require("../middleware/index");


//INDEX - show all blogs
router.get("/", function (req, res) {
  // Get all blogs from DB
  Blog.find({}, function (err, allBlogs) {
    if (err) {
      console.log(err);
    } else {
      res.render("blogs/index", { blogs: allBlogs });
    }
  });
});

//CREATE - add new blog to DB
router.post("/", middleware.isLoggedIn, function (req, res) {
  req.body.blog.user_id = req.user._id;
  Blog.create(req.body.blog, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      req.user.blogs.push(newlyCreated._id);
      req.user.save();
      res.redirect("/blogs");
    }
  });
});

//NEW - show form to create new blog
router.get("/new", middleware.isLoggedIn, function (req, res) {
  res.render("blogs/new");
});

// SHOW - shows more info about one blog
router.get("/:id", function (req, res) {
  //find the blog with provided ID
  Blog.findById(req.params.id).populate("comments").exec(function (err, foundBlog) {
    if (err) {
      console.log(err);
    } else {
      //render show template with that blog
      res.render("blogs/show", { blog: foundBlog });
    }
  });
});

// EDIT Blogs ROUTE
router.get("/:id/edit", middleware.isLoggedIn, middleware.checkBlogOwnership, function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
    res.render("blogs/edit", { blog: foundBlog });
  });
});

// UPDATE Blogs ROUTE
router.put("/:id",middleware.isLoggedIn, middleware.checkBlogOwnership, function (req, res) {
  // find and update the correct blog
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      //redirect somewhere(show page)
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

// DESTROY Blogs ROUTE
router.delete("/:id",middleware.isLoggedIn, middleware.checkBlogOwnership, function (req, res) {
  Blog.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/blogs");
    } else {
      console.log("in delete//////////////////////////")
      res.redirect("/blogs");
    }
  });
});


module.exports = router;