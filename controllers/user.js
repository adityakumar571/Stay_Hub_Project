const User = require("../models/user.js");


//signUp
module.exports.renderSignup=(req, res) => {
    res.render("users/signup.ejs");
  };

module.exports.userSignUp=async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser,(err)=>{
        if(err){
          return next(err);
        }
        req.flash("success", "Welcome to Stayhub");
        res.redirect("/listings");
      });
    
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/singup");
    }
  };


  //login
  module.exports.renderLogin=(req, res) => {
    res.render("users/login.ejs");
  }

  module.exports.userLogin=
    async (req, res) => {
        req.flash("success","Welcome to Stayhub! you are logged in!");
        let redirectUrl=res.locals.redirectUrl||"/listings";
        res.redirect(redirectUrl);
      }
  
//logout
  module.exports.userLogout=(req,res)=>{
    req.logout((err)=>{
    if(err){
        next(err);
    }
    req.flash("success","you are logged out!");
    res.redirect("/listings");
})
}