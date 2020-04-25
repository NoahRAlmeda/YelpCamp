var express = require("express");
var app = express();
let port = 4000;

app.get('/', (req, res) => {
    res.send("This is a test.");
});
// Run the app
app.listen(port,  () => { 
    console.log(`Server ${port} is online!`); 
});