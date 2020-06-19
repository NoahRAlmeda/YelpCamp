let express = require("express");
let router = express.Router();
let passport = require("passport");

// DATABASE MODELS
let User = require("../models/user");

// =============
// ROOT ROUTE
// =============

router.get('/', (req, res) => {
    console.log("Entering GET landing");

    res.render("landing");
});

// =============
//  AUTH ROUTES
// =============

// Shows register form
router.get("/register", (req, res) => {
    res.render("register");
});

// Sign Up logic
router.post("/register", (req, res) => {
    let newUser = new User({username: req.body.username});
    
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            console.log("Error: ", err);
            req.flash("error", err.message);
            return res.render("register");
        }

        passport.authenticate("local")(req, res, () => {
            console.log("successfully registered!");
            req.flash("success", `Weolcome to YelpCamp ${user.username}`);
            res.redirect("/campgrounds");
        });
    });
});

// ===============
//  LOG IN ROUTE
// ===============

// Show Login form
router.get("/login", (req, res) => {
    res.render("login");
});

// Authenticates user
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req, res) => {    
        req.flash("success", `Welcome back ${req.user.username}`);
});

// ==============
//  LOGOUT ROUTE
// ==============

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("error", "You logged Out!");
    res.redirect("/campgrounds");
});

// PAGE NOT FOUND
// app.get("*", (req, res) => {
//     console.log("Error 404!");
//     res.send("Error 404!");
// });

module.exports = router;