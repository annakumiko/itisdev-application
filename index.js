/* DEPENDENCIES */
const express = require('express');
const hbs = require('handlebars');
const exphbs = require('express-handlebars');
// const cookieParser = require('cookie-parser'); //generates cookies to keep track of logged-in user
// const session = require('express-session'); //keeps track of who's logged in
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config();

/* EXPRESS APPLICATION */
const app = express();
const port = process.env.port||9000;
  

/* INITIALIZING COOKIES & SESSION */
/*
app.use(cookieParser());

app.use(session({
	secret: 'sikret',
	name: 'saeshun',
	resave: true,
	saveUninitialized: true
}));
*/

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

app.get('/login', function(req, res){
  res.render('login',{
  });
});

app.get('/verification', function(req, res){
  res.render('verification',{
  });
});

/* TESTING */
/* admin stuff */
app.get('/definecourse', function(req, res){
  res.render('define-course',{
  });
});

app.get('/manageclients', function(req, res){
  res.render('manage-clientlist',{
  });
});

/* trainee stuff */
app.get('/addtrainees', function(req, res){
  res.render('add-trainees',{
  });
});

app.get('/trainer-profile', function(req, res){
  res.render('trainer-profile',{
  });
});

app.get('/createclass', function(req, res){
  res.render('create-class',{
  });
});

app.get('/createquiz', function(req, res){
  res.render('create-quiz',{
  });
});

app.get('/quizlist', function(req, res){
  res.render('quizlist',{
  });
});

app.get('/scoresheet', function(req, res){
  res.render('scoresheet',{
  });
});

/* trainer stuff */
app.get('/clients', function(req, res){
  res.render('clientlist',{
  });
});

app.get('/trainee-profile', function(req, res){
  res.render('trainee-profile',{
  // usersSchema: usersSchema
  });
});

app.get('/contact', function(req, res){
  res.render('contact-client',{
  });
});

app.get('/grades', function(req, res){
  res.render('view-grades',{
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

// DUMMY //

// var usersSchema = {
// 	userID: 123,
// 	userType: trainee,
// 	firstName: bro,
// 	lastName: orbskie,
// 	email: l@yield.com,
// 	password: loool,
// 	uStatus: Active,
// 	deactivated: true
// };