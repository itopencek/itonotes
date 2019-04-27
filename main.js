const express = require('express');
const app = express();
let path = require('path');

app.set('view engine', 'ejs');

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

//midleware for public/static files
app.use(express.static(path.join(__dirname, 'public')));

//Bodyparser
app.use(express.urlencoded({ extended: true }));

//routes
app.use('/', require('./routes/routes'));

//port
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started. http://localhost:${PORT}`));
