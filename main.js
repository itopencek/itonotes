const express = require('express');
const app = express();
const bodyparser = require("body-parser");
let path = require('path');

//post body parser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}));

//views
app.use(express.static(__dirname + '/views'));

//midleware for public/static files
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/', require('./routes/routes'));

//Bodyparser
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

//port
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started. http://localhost:${PORT}`));
