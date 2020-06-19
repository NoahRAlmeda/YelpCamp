let express = require("express");
let router = express.Router();

// DATABASE MODELS
let Campground = require("../models/campground");

// ==== MIDDLEWARE FUNCTIONS ====
let middleware = require("../middleware");

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

router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// ==========================
//  CREATE Campground ROUTES
// ==========================

router.post("/", middleware.isLoggedIn, (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    }

    let newCampground = {name: name, image: image, description: desc, author: author};

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

// =======================
//  EDIT Campground ROUTE 
// =======================
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    let campgroundID = req.params.id;
      
    Campground.findById(campgroundID,(err, foundCampground) => {
        if(err) {
            console.log("ERROR: ", err);
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

// =========================
//  Update Campground ROUTE 
// =========================
router.put("/:id", (req, res) => {
    let campgroundID = req.params.id;
    let updateCampground = req.body.campground;

    Campground.findByIdAndUpdate(campgroundID, updateCampground, (err, updatedCampground) => {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect(`/campgrounds/${campgroundID}`);
        }
    });
});

// =========================
//  DESTROY Campground ROUTE 
// =========================
router.delete("/:id", middleware.checkCampgroundOwnership, async(req, res) => {
    let campgroundID = req.params.id;

    try {
        let foundCampground = await Campground.findById(campgroundID);
        await foundCampground.remove();
        res.redirect("/campgrounds");
    } catch (error) {
        console.log(error.message);
        res.redirect("/campgrounds");
    }
});

module.exports = router;