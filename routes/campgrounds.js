let express = require("express");
let router = express.Router();

// DATABASE MODELS
let Campground = require("../models/campground");

// ===================
//  CAMPGROUND INDEX
// ===================

router.get('/', (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// =======================
//  NEW Campground ROUTES
// =======================

router.get("/new", (req, res) => {
    res.render("campgrounds/new");
});

// ==========================
//  CREATE Campground ROUTES
// ==========================

router.post("/", (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;

    let newCampground = {name: name, image: image, description: desc};

    Campground.create(newCampground, (err, newEntry) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });   
});

// ============
//  SHOW ROUTE - shows more info about one campground
// ============

router.get("/:id", (req, res) => {
    let campgroundID = req.params.id;

    Campground.findById(campgroundID).populate("comments").exec((err, foundCampground) => {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground : foundCampground});
        }
    });
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;