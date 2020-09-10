const bcrypt = require('bcrypt');
const saltRounds = 10;

/* DBs */
const classesModel = require('../models/classesdb');
const classlistsModel = require('../models/classlistsdb');
const clientlistsModel = require('../models/clientlistsdb');
const clientsModel = require('../models/clientsdb');
const coursesModel = require('../models/coursesdb');
const itemsModel = require('../models/itemsdb');
const modulesModel = require('../models/modulesdb');
const quizzesModel = require('../models/quizzesdb');
const resultsModel = require('../models/resultsdb');
const skillassessmentsModel = require('../models/skillassessmentsdb');
const skilltypesModel = require('../models/skilltypesdb');
const traineeanswersModel = require('../models/traineeanswersdb');
const traineelistsModel = require('../models/traineelistsdb');
const traineesModel = require('../models/traineesdb');
const trainersModel = require('../models/trainersdb');
const usersModel = require('../models/usersdb');
const verificationModel = require('../models/verificationdb');
const db = require('../models/db');


// main functions for getting and posting data
const rendFunctions = {

	getLogin: function(req, res, next) {
		if (req.session.user){
			res.redirect('/');
		} else {
			res.render('login', {
			});
		}
	 },
	 
	getVerifyAccount: function(req, res, next) {
		if (req.session.user){
			res.redirect('/');
		} else {
			res.render('verification', {
			});
		}
	 },

	postVerifyAccount: async function(req, res, next) {
		let { email, verifyCode } = req.body;
		var vcode = await db.findOne(verificationModel, {verifyCode: verifyCode});

		try {
			if (!vcode) {  
				res.send({status: 401});
				console.log("bruh u liar") // NO SUCH CODE FOUND !!!
			}

			else {
				bcrypt.compare(email, vcode.email, function(err, match) {
					if (match){
						res.send({status: 200});
					} else
						res.send({status: 401});
				});
			}		
		} catch(e) {
			console.log(e);
		}
	}, 
	
	getHome: function(req, res, next) {
		if (req.session.user) {
			if (req.session.user.userType == "Trainer"){
				res.render('home', {
					loggedIn: true,
					trainer: true,
				});
			}
			else if (req.session.user.userType == "Trainee"){
				res.render('home', {
					loggedIn: true,
					trainee: true,
				});
			}
			else {
				res.render('home', {
					loggedIn: true,
					trainee: false,
					trainer: false,
				});
			}
		} else {
			res.render('login', {
				loggedIn: false
			});
		}
 	},

 	// search among users -> check usertype
 	getProfile: function(req, res, next) {
 		if (req.session.user) {
 			// SEARCH LOGGED IN USER
 			if (req.session.user.userType === "Trainer") {
 				res.render('trainer-profile', {
	 				fullName: req.session.user.lastName + ", " + req.session.user.firstName,
	 				uType: req.session.user.userType
	 			});
	 		}
 			else {
 				res.render('trainee-profile', {
	 				fullName: req.session.user.lastName + ", " + req.session.user.firstName,
	 				uType: req.session.user.userType
	 			});
 			}
 		}	
 		else res.redirect('/');
 	},

 	getCreateClass: function(req, res, next) {
 		if (req.session.user) {
 			res.render('/create-class', {
 				//boom
 			});
 		}
 	},

 	postLogin: async function(req, res, next) {
		let { email, password } = req.body;

		var user = await db.findOne(usersModel, {email: email});

		// SEARCH USER IN DB
		try {
			if (!user) // USER NOT IN DB
				res.send({status: 401});
			else { // SUCCESS
				bcrypt.compare(password, user.password, function(err, match) {
					if (match){
						req.session.user = user;
						res.send({status: 200});
					} else
						res.send({status: 401});
				});
			}		
		} catch(e) {
			console.log(e);
		}
	},

	// LOG OUT not working ????????????????????
 	postLogout: function(req, res) {
		req.session.destroy();
		res.redirect("/login");
	},

	// invisible register :p
	postRegister: async function(req, res, next) {
	//	console.log(req.body);
		try {
			let hash = await bcrypt.hash(req.body.password, saltRounds);
			console.log(hash);
			let insert = await db.insertOne(usersModel,
				{userType: req.body.userType, firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, password: hash, deactivated: false});
			console.log(insert);
		} catch(e) {
			console.log(e);
		}
	},

	getClientsList: function(req, res, next) {
		if (req.session.user){
			res.redirect('/');
		} else {
			res.render('clientlist', {
			});
		}
	 },
}

module.exports = rendFunctions;