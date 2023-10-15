const express = require('express');
const app = express();

const port = 3000;

// Use Handlebars as the view engine
app.set('view engine', 'hbs');

//Serves static files (we need it to import a css file)
app.use(express.static('public'));

//Sets a basic route
const routes = require('./routes/routes.js');
app.use('/', routes);

//Makes the app listen to port 3000
app.listen(port, () => console.log(`App listening to port ${port}`));