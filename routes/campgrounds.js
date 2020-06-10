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

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// ==========================
//  CREATE Campground ROUTES
// ==========================

router.post("/", isLoggedIn, (req, res) => {
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
router.get("/:id/edit", checkCampgroundOwnership, (req, res) => {
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
router.delete("/:id", checkCampgroundOwnership, async(req, res) => {
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

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next) {
     // Checks if a User is logged in
     if(req.isAuthenticated()) {        
        Campground.findById(campgroundID,(err, foundCampground) => {
            if(err) {
                console.log("ERROR: ", err);
                res.redirect("back");
            } else {
                // If User is the author of the post then he can edit
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;