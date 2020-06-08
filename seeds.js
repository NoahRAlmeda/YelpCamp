var mongoose = require("mongoose");
let Comment = require("./models/comment");
var Campground = require("./models/campground");

let data = [
    {
        name: "Culver Summer Camp", 
        image: "https://data.parkbench.com/content/data/businesses/8/e/e/a/9/NjAweDYwMA--_8eea958134562f87d68c772375cd03b2.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "Forrest Summer Camp", 
        image: "https://media-cdn.tripadvisor.com/media/photo-s/12/79/a7/a0/redwood-forrest.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "Desert Summer Camp", 
        image: "https://cdn.mos.cms.futurecdn.net/deaceNXy23NF8VsCrwZPgn.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }
];

function seedDB() {
    // Removes all campgrounds
    Campground.remove({}, (err) => {
        if(err) {
            console.log("Error: ", err);
        } else {
            console.log("All entries in campgroud removed!");
        }
    });

    Comment.remove({}, (err) => {
        if(err) {
            console.log("Error: ", err);
        } else {
            console.log("All entries in comment removed!");

            // Add campgrounds
            data.forEach((seed) => {
                Campground.create(seed, (err, campground) => {
                    if(err) {
                        console.log("Error: ", err);
                    } else {
                        // Create comment
                        Comment.create({
                            text: "This place is great I wish there was internet",
                            author: "Noah"
                        }, (err, comment) => {
                            if(err) {
                                console.log("Error: ", err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment");
                                
                            }
                        });
                    }
                });
            });
        }
    });

    




    // data.forEach((seed) => {
    //     Campground.create(seed, (err, campground) => {
    //         if(err) {
    //             console.log("Error: ", err);
    //         } else {
    //             console.log("Added new campground!");
    //             // Create Comment
    //             Comment.create({
    //                 text: "This place is awesome!",
    //                 author: "Homer"
    //             }, (err, comment) => {
    //                 if(err) {
    //                     console.log("Error: ", err);
    //                 } else {
    //                     campground.comment.push(comment);
    //                     campground.save();
    //                     console.log("Added new comment!");
    //                 }
    //             });
    //         }
    //     });
    // });
}

module.exports = seedDB;