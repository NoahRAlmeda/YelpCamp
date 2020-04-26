var express = require("express");
var app = express();
let port = 4000;

app.set("view engine", "ejs");


app.get('/', (req, res) => {
    console.log("Entering GET landing");

    res.render("landing");
});

app.get('/campgrounds', (req, res) => {
    console.log("Entering GET campgrounds");
    let campgrounds = [
        {name: "Culver Summer Camp", image: "https://data.parkbench.com/content/data/businesses/8/e/e/a/9/NjAweDYwMA--_8eea958134562f87d68c772375cd03b2.jpg"},
        {name: "Guajataca Summer Camp", image: "https://puertorico.com.pr/wp-content/uploads/2013/05/Guajataca-Lake-02.jpg"},
        {name: "Nookz Summer Camp", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFf520NswwAp5Ru7kWEoaMoDuhMQhhhj8nPpqJwloX9wlPPEtY&s"}
    ];

    res.render("campgrounds", {campgrounds: campgrounds});
});

app.get("*", (req, res) => {
    console.log("Error 404!");
    res.send("Error 404!");
});

// Run the app
app.listen(port,  () => { 
    console.log(`Server ${port}: Welcome to YelpCamp!`); 
});