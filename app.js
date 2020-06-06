// NODE MODULES
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
let seedDB = require("./seeds");

// DATABASE MODELS
let Comment = require("./models/comment");
let Campground = require("./models/campground");
// let User = require("./models/user");



let port = 4000;
let connectionString = "mongodb://127.0.0.1:27017/yelpcamp";

mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.once('open', _ => {
    console.log('Database connected:', connectionString);
})

db.on('error', (err) => {
    console.error('connection error:', connectionString);
})

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

seedDB();

app.get('/', (req, res) => {
    console.log("Entering GET landing");

    res.render("landing");
});

app.get('/campgrounds', (req, res) => {
    console.log("Entering GET campgrounds");
    Campground.find({}, (err, allCampgrounds) => {
        if(err) {
            console.log(err);
        } else {
            console.log(allCampgrounds);
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});


// NEW Campground ROUTES
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

app.post("/campgrounds", (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;

    let newCampground = {name: name, image: image, description: desc};

    Campground.create(newCampground, (err, newEntry) => {
        if(err) {
            console.log(err);
        } else {
            console.log(newEntry);
            res.redirect("/campgrounds");
        }
    });   
});


// SHOW ROUTE - shows more info about one campground
app.get("/campgrounds/:id", (req, res) => {
    let campgroundID = req.params.id;

    Campground.findById(campgroundID).populate("comments").exec((err, foundCampground) => {
        if(err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground : foundCampground});
        }
    });
});

// COMMENT ROUTES
app.get("/campgrounds/:id/comments/new", (req, res) => {
    let campID = req.params.id;

    Campground.findById(campID, (err, foundCampground) => {
        if(err) {
            console.log("Error: ", err);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

app.post("/campgrounds/:id/comments", (req, res) => {
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
                    foundCampground.comments.push(newComment);
                    foundCampground.save();
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            });
        }
    });
});

// PAGE NOT FOUND
// app.get("*", (req, res) => {
//     console.log("Error 404!");
//     res.send("Error 404!");
// });

// Run the app
app.listen(port,  () => { 
    console.log(`Server ${port}: Welcome to YelpCamp!`); 
});