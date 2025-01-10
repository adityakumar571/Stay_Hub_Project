const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner,validateListing } = require("..//middleware.js");

const listingController=require("../controllers/listing.js");
const multer  = require('multer')
const{storage}=require("../CloudConfig.js")
const upload = multer({ storage });


//index and createListing
router.route("/")
.get( wrapAsync(listingController.index))
.post(
 isLoggedIn,
  upload.single('listing[image]'),
  wrapAsync(listingController.createListing)
);


//new Route
router.get("/new", isLoggedIn, (listingController.renderForm));
//show ,update and delete
router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put( isLoggedIn,isOwner,validateListing, wrapAsync(listingController.renderUpdate))
.delete(isOwner,isLoggedIn,
wrapAsync(listingController.renderDelete));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner,wrapAsync(listingController.renderEditForm));


module.exports = router;
