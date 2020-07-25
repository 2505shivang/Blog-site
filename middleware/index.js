var Blog = require("../models/blog");
var Comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkBlogOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Blog.findById(req.params.id, function (err, foundBlog) {
            if (err) {
                res.redirect("/blogs");
            } else {
                // does user own the blog?
                console.log(foundBlog);
                if (foundBlog.user_id == req.user._id) {
                    next();
                } else {
                    res.redirect("/blogs");
                }
            }
        });
    } else {
        res.redirect("/blogs");
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        console.log("123123322222222222222222");
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("/blogs");
            } else {
                // does user own the comment?
                var user = {id: req.user.id , username: req.user._id};
                if (foundComment.author,user){
                    console.log(foundComment);
                    console.log("123123322222222222222222");
                    console.log("123123322222222222222222");
                    next();
                } else {
                    res.redirect("/blogs");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = middlewareObj;