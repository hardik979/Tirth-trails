require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const mongoose = require("mongoose");
const Blog = require("./models/blog");


const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middleware/authentication");
PORT = process.env.PORT || 8001
mongoose.connect(process.env.MONGO_URL )
.then((e)=>console.log('MongoDB is connected'));


app.set("view engine","ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public'))); 
app.use(express.static(path.join(__dirname, '/')));
app.get("/",async(req,res)=>{
    const allBlogs = await Blog.find({});
 res.render("home",{
    user:req.user,
    blogs:allBlogs,
 });

});

app.use("/user", userRoute);
app.use("/blog",blogRoute);


app.listen(PORT,()=>console.log(`server started at http://localhost:${PORT}`) );