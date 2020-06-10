// NODEJS MODULES
let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let passport = require("passport");
let LocalStrategy = require("passport-local");
let methodOverride = require("method-override");
let seedDB = require("./seeds");

// DATABASE MODELS
let User = require("./models/user");

// PAGES ROUTES
let indexRoutes = require("./routes/index");
let campgroundsRoutes = require("./routes/campgrounds");
let commentsRoutes = require("./routes/comments");


let port = 4000;
let connectionString = "mongodb://127.0.0.1:27017/yelpcamp";

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

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
app.use(methodOverride("_method"));

// Seed function made to populate the database with dummy data
// seedDB();

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

app.use(indexRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);

// Run the app
app.listen(port,  () => { 
    console.log(`Server ${port}: Welcome to YelpCamp!`); 
});