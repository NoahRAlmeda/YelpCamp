// NODE MODULES
let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let passport = require("passport");
let LocalStrategy = require("passport-local");
let seedDB = require("./seeds");

// DATABASE MODELS
let Comment = require("./models/comment");
let Campground = require("./models/campground");
let User = require("./models/user");



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

// PASSPORT Configuration
app.use(require("express-session")({
    secret: "Noah Almeda",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.get('/', (req, res) => {
    console.log("Entering GET landing");

    res.render("landing");
});

app.get('/campgrounds', (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if(err) {
            console.log(err);
        } else {
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
app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
    let campID = req.params.id;

    Campground.findById(campID, (err, foundCampground) => {
        if(err) {
            console.log("Error: ", err);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
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

// AUTH ROUTES

// Shows register form
app.get("/register", (req, res) => {
    res.render("register");
});

// Sign Up logic
app.post("/register", (req, res) => {
    let newUser = new User({username: req.body.username});
    
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            console.log("Error: ", err);
            return res.render("register");
        }

        passport.authenticate("local")(req, res, () => {
            console.log("successfully registered!");
            res.redirect("/campgrounds");
        });
    });
});

// Show Login form
app.get("/login", (req, res) => {
    res.render("login");
});


app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req, res) => {    
});

// LOGOUT ROUTE
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/campgrounds");
});

// PAGE NOT FOUND
// app.get("*", (req, res) => {
//     console.log("Error 404!");
//     res.send("Error 404!");
// });

// Function which validates if user is logged in
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

// Run the app
app.listen(port,  () => { 
    console.log(`Server ${port}: Welcome to YelpCamp!`); 
});