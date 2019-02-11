var express = require("express");
var methodOverride = require("method-override");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type:Date, default:Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);


// RESTful routes

app.get("/",function(req, res) {
    res.redirect("/blogs");    
});

// Index route
app.get("/blogs",function(req,res){
    Blog.find({}, function(err,blogs){
        if(err){
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    });
    
});

// New route
app.get("/blogs/new",function(req, res) {
    res.render("new");
});

//Create route
app.post("/blogs", function(req,res){
   Blog.create(req.body.blog,function(err,newBlog){
       if(err){
           res.render("new");
       } else {
           res.redirect("/blogs");
       }
   }); 
});

//Show route
app.get("/blogs/:id",function(req, res) {
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show",{blog: foundBlog});
        }
    });
});

//Edit route
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit",{blog: foundBlog});
        }
    });
    
});

//Update route
app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("blogs" + req.params.id);
        }
    });
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server has started!");
});

