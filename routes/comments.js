var express = require("express");
var router = express.Router({ mergeParams: true });
var Blog = require("../models/blog");
var Comment = require("../models/comment");
var middleware = require("../middleware/index");

//Comments New
router.get("/new", middleware.isLoggedIn, function (req, res) {
  // find blog by id
  Blog.findById(req.params.id, function (err, blog) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { blog: blog });
    }
  })
});

//Comments Create
router.post("/", middleware.isLoggedIn, function (req, res) {
  //lookup blog using ID
  Blog.findById(req.params.id, function (err, blog) {
    if (err) {
      console.log(err);
      res.redirect("/blogs");
    } else {

      var author = { id: req.user._id, 
                    username: req.user.username};
      var newComment = {text : req.body.comment.text , author: author}              
      Comment.create(newComment, function (err, comment) {
        if (err) {
          console.log(err);
        } else {
          blog.comments.push(comment);
          blog.save();
          res.redirect('/blogs/' + blog._id);
        }
      });
    }
  });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit",middleware.isLoggedIn, middleware.checkCommentOwnership, function (req, res) {
  Comment.findById(req.params.comment_id, function (err, foundComment) {
    if (err) {
      res.redirect("/"+req.params.comment_id);
    } else {
      res.render("comments/edit", { blog_id: req.params.id, comment: foundComment });
    }
  });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
  //findByIdAndRemove
  console.log("h//////////////////")
  Blog.findById(req.params.id, function(err, blog){
      if(err){
        res.redirect("/blogs/"+blog._id);
      }else{
        blog.comment.findByIdAndRemove(req.params.comment_id);
        Comment.findByIdAndRemove(req.params.comment_id);
      }

  });
  
});

module.exports = router;