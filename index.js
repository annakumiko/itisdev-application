/* DEPENDENCIES */
const express = require('express');
const hbs = require('handlebars');
const exphbs = require('express-handlebars');
//const cookieParser = require('cookie-parser'); //generates cookies to keep track of logged-in user
//const session = require('express-session'); //keeps track of who's logged in
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config();

/* EXPRESS APPLICATION */
const app = express();
const port = process.env.port||9000;
  

/* INITIALIZING COOKIES & SESSION */
/* app.use(cookieParser());

app.use(session({
	secret: 'sikret',
	name: 'saeshun',
	resave: true,
	saveUninitialized: true
})); */

/* CREATE HBS ENGINE */
app.engine('hbs', exphbs({  
  extname: 'hbs',
  defaultView: 'main',
layoutsDir: path.join(__dirname, '/views/layouts'),
partialsDir: path.join(__dirname, '/views/partials')
}));

app.get('/', function(req, res){
  res.render('home',{
    layout: 'main'
  });
});

app.set('view engine', 'hbs');

const router = require('./router/vahubRouter');
app.use('/', router);

app.use(express.static(__dirname));
app.use(express.static('public'));

/* PORT */
app.listen(port, function(){
    console.log("Listening to http://localhost:" + port);
});