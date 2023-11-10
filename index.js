const express = require('express');
const exp_hbs = require('express-handlebars');
const path = require('path');

const mongoose = require('mongoose');
const MONGODB_URL = "mongodb+srv://test_user:test123@naturellesalon.oxkbfbn.mongodb.net/?retryWrites=true&w=majority";

const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();
const port = 3000;

const hbs = exp_hbs.create({
    extname: 'hbs',
    layoutsDir: __dirname + '/views/layouts',
    defaultLayout: 'index',
    partialsDir: path.join(__dirname, 'views/partials'),
    helpers: {
        isDefined(variable) { return variable !== undefined; },
        isUndefined(variable) { return variable === undefined; },
        isEmpty(string) { return string === ''; }
    }
});

// Use Handlebars as the view engine
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine);

app.use(express.urlencoded({extended: true}));

//Serves static files (we need it to import a css file)
app.use(express.static(__dirname + '/public/'));

mongoose.connect(MONGODB_URL);

app.use(session({
    secret: 'naturelle-salon',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: MONGODB_URL
    })
}));

//Sets a basic route
const routes = require('./routes/routes.js');
app.use('/', routes);

//Makes the app listen to port 3000
app.listen(port, () => console.log(`App listening to port ${port}`));