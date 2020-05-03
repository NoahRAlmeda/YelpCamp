var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");


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

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

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
            res.render("campgrounds", {campgrounds: allCampgrounds});
        }
    });
});

app.get("/campgrounds/new", (req, res) => {
    res.render("new");
});

app.post("/campgrounds", (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let newCampground = {name: name, image: image};

    Campground.create(newCampground, (err, newEntry) => {
        if(err) {
            console.log(err);
        } else {
            console.log(newEntry);
            res.redirect("/campgrounds");
        }
    });   
});

app.get("*", (req, res) => {
    console.log("Error 404!");
    res.send("Error 404!");
});

// Run the app
app.listen(port,  () => { 
    console.log(`Server ${port}: Welcome to YelpCamp!`); 
});