if(process.env.NODE_ENV !="production"){
  require('dotenv').config();
}

console.log(process.env.secret)
const mongoose = require("mongoose");
const MongoStore=require("connect-mongo")

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const EjsMate = require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");

const flash=require("connect-flash")
const session=require("express-session");

const listings=require("./routes/listing.js");
const reviews = require("./routes/reviews.js");
const userRouter=require("./routes/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");

const User=require("./models/user.js")
 const multer=require('multer');
const { error } = require('console');
 const upload=multer({dest:'uploads/'})





// Changed variable name to start with a capital letter as per convention

const MONGO_URL =process.env.ATLAS_DBURL;
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("Connection error:", err); // Changed console.log to console.error for better indication of error
  });

async function main() {
  await mongoose.connect(MONGO_URL); // Removed quotes around MONGO_URL variable
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", EjsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store=MongoStore.create({
  mongoUrl:MONGO_URL,
  crypto:{
    secret:process.env.SECRETKEY,
  },
  touchAfter:24*3600
})

store.on("error",()=>{
  console.log("Error in Mongo session",error)
})

const sessionOptions={
  store,
  secret:process.env.SECRETKEY,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*1000,
    maxAge:7*24*60*1000,
    httpOnly:true,
  },
};
app.get("/", (req, res) => {
  res.render("index"); // Corrected response message
});

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",userRouter);

 
app.all("*",(req,res,next)=>{
next(new ExpressError(404,"Page Not found!"));
});
// Global Error Handler
app.use((err, req, res, next) => {
  let{statusCode=500, message="something went wrong!"}=err;
  res.status(statusCode).render("listings/error.ejs",{message});
  //res.status(statusCode).send(message);
});

const PORT = 8080; // Corrected port variable name
app.listen(PORT, () => {
  console.log("Server is working on port " + PORT); // Corrected console log message
});
