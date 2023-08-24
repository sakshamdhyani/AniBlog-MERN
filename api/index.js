const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const {connect} = require("./config/database.js");
const Post = require("./models/Post.js");
const User = require("./models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// for file upload
const multer = require("multer");
const uploadMiddleware = multer({dest: 'uploads/'});
const fs = require("fs");

const secret = "saksham"

// middlewares
app.use(cors({credentials:true,origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads' , express.static(__dirname + '/uploads'));

// connection to DB
connect();

// routes

// register route
app.post('/register' , async (req,res) => {
    const {firstName,lastName,email,username,password} = req.body;
    
    try{
        const userDoc = await User.create({
            firstName,
            lastName,
            email,
            username,
            password: await bcrypt.hash(password , 10),
        });

        res.json(userDoc);
    }
    catch(error){
        console.log(error);
        res.status(400).json(error);
    }
});

// login route
app.post('/login' , async (req,res) => {
    const {username , password} = req.body;
    const userDoc = await User.findOne({username});
    if(!userDoc){
        return res.status(404).json({
            success:false,
            message: "User not found",
        })
    }
    const passOk = await bcrypt.compare(password , userDoc.password);
    if(!passOk){
        return res.status(400).json({
            success:false,
            message: "Password is incorrect",
        })
    }

    // sending jwt token

    jwt.sign({ username, id:userDoc._id} , secret , {} , (error , token) => {
        if(error) throw error;
        res.cookie('token' , token).json({
            id: userDoc._id,
            username, 
        });
    })

})

// fetching token from cookies ---- route
app.get('/profile' , (req,res) => {

    const {token} = req.cookies;
    jwt.verify(token , secret , {} , (error,info) => {
        if(error) throw error;
        res.json(info);
    });
});


// logout route
app.post('/logout' , (req,res) => {
    res.cookie('token' , "").json('ok');
})


// create a new post
app.post('/post' ,uploadMiddleware.single('file') , async (req,res) => {

    const {originalname , path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length -1];
    const newPath = path + '.' + ext;
    fs.renameSync(path , newPath);    


    const {token} = req.cookies;

    jwt.verify(token , secret , {} , async (error,info) => {

        if(error) throw error;
        
        const {title , summary , content} = req.body;

        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: newPath,
            author: info.id,
        });
        
        res.json(postDoc);
    });
   
})


// sending all post to frontend
app.get('/post' , async(req,res) => {
    res.json(
        await Post.find()
        .populate('author' , ['username'])
        .sort({createdAt: -1})
        .limit(20),
    );
})


// sending a single post info to frontend
app.get('/post/:id' , async(req,res) => {
    
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author' , ['username']);
    res.json(postDoc);
})

app.delete('/delete/:id' , async(req,res) => {

    const {id} = req.params;
    const postDoc = await Post.findByIdAndDelete(id);
    res.json(postDoc);

})


// updating post
app.put('/post' ,uploadMiddleware.single('file'), async (req,res) => {

    let newPath = null;
    if(req.file){
        const {originalname , path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length -1];
        newPath = path + '.' + ext;
        fs.renameSync(path , newPath); 
    }

    const {token} = req.cookies;

    jwt.verify(token , secret , {} , async (error,info) => {

        if(error) throw error;
        
        const {id , title , summary , content} = req.body;
        const postDoc = await Post.findById(id);
        
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if(!isAuthor) {
           return res.status(400).json('Your are not the author')
        }

        await postDoc.updateOne(
            {
            title, 
            summary , 
            content,
            cover: newPath ? newPath : postDoc.cover,
        });
        
        res.json(postDoc);
    });
})

app.listen(4000);


// mongodb+srv://dhyanisaksham12:kYXjUhoIGRj4LMx2@cluster0.li5lvxm.mongodb.net/