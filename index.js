const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const path = require('path')

const port = 3000;

const hbs = exphbs.create({
    extname      :'hbs',
    layoutsDir   : __dirname + '/views/layouts',
    defaultLayout: 'index',
    partialsDir  : path.join(__dirname, 'views/partials')
});

// Use Handlebars as the view engine
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine);

//Serves static files (we need it to import a css file)
app.use(express.static(__dirname + '/public/'));

//Sets a basic route
const routes = require('./routes/routes.js');
app.use('/', routes);

//Makes the app listen to port 3000
app.listen(port, () => console.log(`App listening to port ${port}`));