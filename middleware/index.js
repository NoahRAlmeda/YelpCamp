let Campground = require("../models/campground");
let Comment = require("../models/comment");

let middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    let campgroundID = req.params.id;

    // Checks if a User is logged in
    if(req.isAuthenticated()) {        
        Campground.findById(campgroundID,(err, foundCampground) => {
            if(err) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                // If User is the author of the post then he can edit
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
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
};

module.exports = middlewareObj;