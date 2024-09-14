const express = require("express");
const urlRoute = require('./routes/url')
const { connectToMongoDB} = require('./connect')
const URL = require("./model/url")
const app = express();
const PORT =8001;
const path = require('path')
const cookieParser = require('cookie-parser');
const {restrictToLoggedinUseronly, checkAuth} = require('./middlewares/auth');

const staticRouter = require("./routes/staticRouter")
const userRoute= require('./routes/user')

connectToMongoDB("mongodb://localhost:27017/short-url")
.then (() => console.log("Mongodb connected")
)

app.set("view engine", "ejs")
app.set('views',path.resolve("./views"))
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());


app.use(express.json())

app.use("/url",restrictToLoggedinUseronly,urlRoute);
app.use("/user",userRoute);
app.use("/",checkAuth,staticRouter);   //any router starts with / we will use this router

app.get('/url/:shortId',async(req,res)=>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId,
    },
   {
    $push:{
        visitHistory: {timesstamp:Date.now()},
    },
   });
res.redirect(entry.redirectURL);
});

app.listen(PORT,()=> console.log("Server started at ",PORT)
)

