let express = require("express");
let router = express.Router({mergeParams: true});
let Campground = require("../models/campground");
let Comment = require("../models/comment");


// ===================
//  NEW COMMENT ROUTE
// ===================

router.get("/new", isLoggedIn, (req, res) => {
    let campID = req.params.id;

    Campground.findById(campID, (err, foundCampground) => {
        if(err) {
            console.log("Error: ", err);
        } else {
            console.log("FOUND COMMENTSS: ", foundCampground);
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

// ======================
//  CREATE COMMENT ROUTE
// ======================
router.post("/", isLoggedIn, (req, res) => {
    let campID = req.params.id;
    let postComment = req.body.comment;

    Campground.findById(campID, (err, foundCampground) => {
        if(err) {
            console.log("Error: ", err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(postComment, (err, newComment) => {
                if(err) {
                    console.log("Error: ", err);
                } else {
                    // Add username and ID to comment
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;

                    newComment.save(); // save comment

                    foundCampground.comments.push(newComment);  // Pushes new comment to campground
                    foundCampground.save(); // Saves comment to campground
                    console.log(foundCampground);
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            });
        }
    });
});


// MIDDLEWARE Function
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;