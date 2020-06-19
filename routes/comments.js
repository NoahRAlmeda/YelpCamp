let express = require("express");
let router = express.Router({mergeParams: true});

// DATABASE MODELS
let Campground = require("../models/campground");
let Comment = require("../models/comment");

// ==== MIDDLEWARE FUNCTIONS ====
let middleware = require("../middleware");

// ===================
//  NEW COMMENT ROUTE
// ===================
router.get("/new", middleware.isLoggedIn, (req, res) => {
    let campID = req.params.id;

    Campground.findById(campID, (err, foundCampground) => {
        if(err) {
            req.flash("error", "Unable to find campground");
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

// ======================
//  CREATE COMMENT ROUTE
// ======================
router.post("/", middleware.isLoggedIn, (req, res) => {
    let campID = req.params.id;
    let postComment = req.body.comment;

    Campground.findById(campID, (err, foundCampground) => {
        if(err) {
            req.flash("error", "Unable to find campground");
            res.redirect("/campgrounds");
        } else {
            Comment.create(postComment, (err, newComment) => {
                if(err) {
                req.flash("error", "Unable to create comment");
                    console.log("Error: ", err);
                } else {
                    // Add username and ID to comment
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;

                    newComment.save(); // save comment

                    foundCampground.comments.push(newComment);  // Pushes new comment to campground
                    foundCampground.save(); // Saves comment to campground
                    console.log(foundCampground);
                    req.flash("success", "Successfuly posted comment");
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            });
        }
    });
});

// ===================
//  EDIT COMMENT ROUTE
// ===================
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    let commentID = req.params.comment_id;
    let campID = req.params.id;

    Comment.findById(commentID, (err, foundComment) => {
        if(err) {
            console.log("ERROR: ", err);
        } else {
            res.render("comments/edit", {comment: foundComment, campID: campID});
        }
    });
});

// ======================
//  UPDATE COMMENT ROUTE
// ======================
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    let commentID = req.params.comment_id;
    let updateComment = req.body.comment;

    Comment.findByIdAndUpdate(commentID, updateComment, (err, updatedComment) => {
        if(err) {
            console.log("ERROR: ", err);
            res.redirect("back");
        } else {
            req.flash("success", "Comment updated!");
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

// ======================
//  DESTROY COMMENT ROUTE
// ======================
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    let commentID = req.params.comment_id;

    Comment.findByIdAndRemove(commentID, (err, deletedComment) => {
        if(err) {
            console.log("ERROR: ", err);
            res.redirect("back");
        } else {
            req.flash("success", "Successfully deleted comment");
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

module.exports = router;