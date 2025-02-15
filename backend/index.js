const port = process.env.PORT || 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { type } = require("os");

app.use(express.json());
app.use(cors());

// Database connection with mongodb
mongoose.connect("mongodb+srv://mohammedaslam1219:Aslam2023@cluster0.lm3ddnq.mongodb.net/e-commerce");

// API Creation

app.get("/",(req,res)=>{
    res.send("Express app is running")
})

// Image Storage Engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

// Creating upload Endpoint for images
app.use('https://ecommerce-backend-oz1v.onrender.com/images',express.static('upload/images'))
app.post("https://ecommerce-backend-oz1v.onrender.com/upload",upload.single('product'),(req,res)=>{
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})

// Schema for creating products

const Product = mongoose.model("Product",{
    id:{
        type: Number,
        required: true
    },
    name:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    new_price:{
        type: Number,
        required: true,
    },
    old_price:{
        type: Number,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now,
    },
    available:{
        type: Boolean,
        default: true,
    },
})

app.post('https://ecommerce-backend-oz1v.onrender.com/addproduct', async(req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
    else{
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    })
    console.log(product);
    await product.save();
    console.log("saved");
    res.json({
        success: true,
        name: req.body.name,
    })
})

// Creating API for deleting products

app.post('https://ecommerce-backend-oz1v.onrender.com/removeproduct',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name,
    })
})

// Creating API for getting all products

app.get('https://ecommerce-backend-oz1v.onrender.com/allproducts', async (req,res)=>{
    let products = await Product.find({});
    console.log("All products fetched");
    res.send(products);
})


// User schema

const Users = mongoose.model("users", {
    name:{
        type: String,
    },
    email:{
        type: String,
        unique: true,
    },
    password:{
        type: String,
    },
    cartData:{
        type: Object,
    },
    date:{
        type: Date,
        default: Date.now,
    }
})

// Creating Endpoint for User signup

app.post('https://ecommerce-backend-oz1v.onrender.com/signup', async (req,res)=>{

    let check = await Users.findOne({email:req.body.email});
    if (check) {
        return res.status(400).json({success:false,errors:"existing user found with same mail"})
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i]=0;        
    }
    const user = new Users({
        username: req.body.name,
        email: req.body.email,
        password: req.body.password,
        cartData:cart,
    })
    await user.save();

    const data = {
        user:{
            id: user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
})

//Creating Endpoint for login

app.post('https://ecommerce-backend-oz1v.onrender.com/login', async (req, res)=>{
    let user = await Users.findOne({email:req.body.email});
    if (user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data, "secret_ecom");
            res.json({success:true,token});
        }
        else{
            res.json({sucess:false,errors:"Wrong Password"});
        }
    }
    else {
        res.json({success:false,errors:"Wrong email ID"})
    }
})

// Creating endpoint for newcollection
app.get('https://ecommerce-backend-oz1v.onrender.com/newcollections', async (req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    res.send(newcollection);
})

// Creating endpoint for popular in women

app.get('https://ecommerce-backend-oz1v.onrender.com/popularinwomen', async (req,res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    res.send(popular_in_women);
})

app.listen(port, (error)=>{
    if(!error){
        console.log("Server running on port "+port);
    }
    else {
        console.log("error:"+error);
    }
});