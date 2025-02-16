const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const {v4 : uuidv4} = require("uuid");
const multer = require("multer");
// import { v4 as uuidv4 } from "uuid";

const port = 8080;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended : "true"})); // to parse the incoming url
app.use(express.static(path.join(__dirname,"public")));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    } // Date.now() generates a unique number based on the current time.
});
const upload = multer({ storage });

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
    if(!post){
        res.status(404).send("post not found to show");
    }
    res.render("show.ejs",{post});
})

// update the new post data and return to the home page
app.post("/posts/new",upload.single("image"),(req,res)=> {
    if(!req.file){
        res.status(404).send("File not uploaded");
    }
    let {username,caption} = req.body;
    let extname = path.extname(req.file.filename).toLowerCase();
    if(extname != ".heic" && extname != ".heif"){
        imagelink = "uploads/" + req.file.filename;
        let id = uuidv4();
        posts.push({id,username,imagelink,caption});
        res.redirect("/posts");
    }else {
        res.status(404).send("<h1>file format not supported</h1><h3>Donot upload in heic or heif format</h3>");
    }
});

// display form to edit the post
app.get("/posts/:id/edit",(req,res)=> {
    let {id} = req.params;
    let post = posts.find((p) => p.id === id);
    if(!post){
        res.status(404).send("post not found to edit");
    }
    if(!id){
        res.status(404).send("post not found");
    }
    res.render("edit.ejs", {post});
});

// update the post
app.patch("/posts/:id",upload.single("image"),(req,res)=> {
    if(!req.file){
        res.status(404).send("File not uploaded");
    }
    let {id} = req.params;
    let {caption} = req.body;
    let extname = path.extname(req.file.filename).toLowerCase();
    if(extname != ".heic" && extname != ".heif"){
        let imagelink = "uploads/" + req.file.filename;
        let post = posts.find( (p) => p.id === id);
        if(!post){
            res.status(404).send("post not found to edit");
        }
        post.imagelink = imagelink;
        post.caption = caption;
        res.redirect("/posts");
    }else {
        res.status(404).send("<h1>file format not supported</h1><h3>Donot upload in heic or heif format</h3>");
    }
    
})

// deleting a posts
app.delete("/posts/:id",(req,res)=> {
    let id = req.params.id;
    let post = posts.find((p) => p.id === id);
    if(!post){
        res.status(404).send("post not found to delete");
    }
    posts = posts.filter((p) => p.id != id);
    res.redirect("/posts");
})

app.listen(port , () => {
    console.log(`server started at port ${port}`);
})