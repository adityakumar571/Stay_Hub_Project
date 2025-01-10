const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


const userContorller=require("../controllers/user.js")

router.route("/signup")
.get(userContorller.renderSignup)
.post( wrapAsync(userContorller.userSignUp));


router.route("/login")
.get(userContorller.renderLogin)
.post(saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),userContorller.userLogin);


router.get("/logout",userContorller.userLogout);

module.exports = router;
