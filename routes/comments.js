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

// ===================
//  EDIT COMMENT ROUTE
// ===================
router.get("/:comment_id/edit", checkCommentOwnership, (req, res) => {
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
router.put("/:comment_id", checkCommentOwnership, (req, res) => {
    let commentID = req.params.comment_id;
    let updateComment = req.body.comment;

    Comment.findByIdAndUpdate(commentID, updateComment, (err, updatedComment) => {
        if(err) {
            console.log("ERROR: ", err);
            res.redirect("back");
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

// ======================
//  DESTROY COMMENT ROUTE
// ======================
router.delete("/:comment_id", checkCommentOwnership, (req, res) => {
    let commentID = req.params.comment_id;

    Comment.findByIdAndRemove(commentID, (err, deletedComment) => {
        if(err) {
            console.log("ERROR: ", err);
            res.redirect("back");
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
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

function checkCommentOwnership(req, res, next) {
    let commentID = req.params.comment_id;

    // Checks if a User is logged in
    if(req.isAuthenticated()) {        
       Comment.findById(commentID, (err, foundComment) => {
           if(err) {
               console.log("ERROR: ", err);
               res.redirect("back");
           } else {
               // If User is the author of the comment then he can edit
               if (foundComment.author.id.equals(req.user._id)) {
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