const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const {v4 : uuidv4} = require("uuid");
// import { v4 as uuidv4 } from "uuid";

const port = 8080;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended : "true"})); // to parse the incoming url
app.use(express.static(path.join(__dirname,"public")));


// data
let posts = [
    {
        id : uuidv4(),
        username : "sanjayreddy",
        imagelink : "images/myphoto.jpeg",
        caption : "My photo on 19th bday"
    },
    {
        id : uuidv4(),
        username : "apple",
        imagelink : "images/image1.jpeg",
        caption : "apple photo"
    },
    {
        id : uuidv4(),
        username : "mango",
        imagelink : "images/image2.jpeg",
        caption : "mango image"
    },
    {
        id : uuidv4(),
        username : "cherry",
        imagelink : "images/image3.jpeg",
        caption : "cherry photo"
    }
    
];

// display all posts
app.get("/posts",(req,res)=> {
    res.render("index.ejs",{posts});
})

// display form to add new post
app.get("/posts/new",(req,res)=> {
    res.render("new.ejs");
})

// display the single post
app.get("/posts/:id",(req,res)=> {
    let id = req.params.id;
    let post = posts.find((p) => p.id === id);
    res.render("show.ejs",{post});
})

// update the new post data and return to the home page
app.post("/posts/new",(req,res)=> {
    let {username,imagelink,caption} = req.body;
    imagelink = "images/" + imagelink;
    let id = uuidv4();
    posts.push({id,username,imagelink,caption});
    res.redirect("/posts");
})

// display form to edit the post
app.get("/posts/:id/edit",(req,res)=> {
    let {id} = req.params;
    let post = posts.find((p) => p.id === id);
    res.render("edit.ejs", {post});
})

// update the post
app.patch("/posts/:id",(req,res)=> {
    let {id} = req.params;
    let {imagelink,caption} = req.body;
    imagelink = "images/" + imagelink;
    let post = posts.find( (p) => p.id === id);
    post.imagelink = imagelink;
    post.caption = caption;
    res.redirect("/posts");
})

// deleting a posts
app.delete("/posts/:id",(req,res)=> {
    let id = req.params.id;
    let post = posts.find((p) => p.id === id);
    posts = posts.filter((p) => p.id != id);
    res.redirect("/posts");
})

app.listen(port , () => {
    console.log(`server started at port ${port}`);
})