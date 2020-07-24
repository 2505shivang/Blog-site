var express           = require('express'),
    bodyParser        = require('body-parser'),
    mongoose          = require('mongoose'),
    methodOverride    = require('method-override'),
    expressSanitizer  = require('express-sanitizer');

//Models
var blogs = require('./models/blog.js');
const { request } = require('express');


var app = express();

//Connecting DataBase

mongoose.connect('mongodb://localhost:27017/blogs', {
    useUnifiedTopology: true,
    useNewUrlParser:true
})
.then(() => console.log('Connected to DB!!'))
.catch(error => console.log(error.message));

//config
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use( methodOverride("_method"));


//landing page
app.get("/", function(req,res){
    res.render("landing");
});

//blogs page
app.get("/blogs", function(req,res){
    blogs.find({}, function(err, allblogs){
        if(err){
            console.log(err);
        }else{
            res.render("blogs", {blogs: allblogs});
        }
    });
});

//crate new blog
app.post("/blogs", function(req,res){
    console.log(res.body.blog);
    blogs.create({
        Author: "shivang",
        image: "data:image/jpeg;base64,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",
        content : "blah blah blah",
    }, function(err, newblog){
        if(err){
            console.log(err);
        } else{
            res.redirect('/blogs');
        }
    });
});

//new blog form
app.get("/blogs/new", function(req,res){
    res.render("NewBlog");
});

//show page
app.get("/blogs/:id", function(req,res){
    blogs.findById(req.params.id, function(err,foundblog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("blog", {blog:foundblog});
        }
    });
});

//update
app.get('/blogs/:id/edit',function(req,res){
    blog.findById(req.params.id, function(err,foundblog){
        if(err){
            res.redirect('/blogs');
        }else {
            res.render('editblog',{blog : foundblog});
        }
    });
});

app.put('/blogs/:id', function(req,res){

    request.body.blog = req.sanitizer(request.body.blog);

    blogs.findById(req.params.id, req.body.blog, function(err, updatedblog){
        if(err){
            res.redirect("/blogs");
        }else {
            res.redirect("/blogs"+req.params.id);
        }
    });
});


//Delete
app.delete("/blogs/:id", function(req,res){
    blogs.findById(req.params.id, function(err){
        if(err){
            res.send(error);
        } else {
            res.redirect("/blogs");
        }
    });
});

//server start
app.listen(3000, process.env.IP,function(){
    console.log("server Started!!!");
});








