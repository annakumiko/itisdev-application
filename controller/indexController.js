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
	 
	getVerification: function(req, res, next) {
		// if user not verified..
		res.render('verification', {
			});
	},

	postVerification: async function(req, res, next) { // nde pumamasok d2 wat
		let { email, verifyCode } = req.body;
		var vCode = await db.findOne(verificationModel, {verifyCode: verifyCode});

		try {
			if (!vCode) { 
				res.send({status: 401}) 
			}
			else {
				bcrypt.compare(email, vcode.email, function(err, match) {
					if (match) {
						// console.log("hello");
						req.session.user = user;
						res.send({status: 200});
					} else
						res.send({status: 401});
				});
			}		
				if (email === vCode.email) 
					res.send({status: 200});
				else 
					res.send({status: 500});
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
 				/*
 					LOGIC T___T
 					-- find userID from classlists -
 					-- "get" all its classes (classID) - 
 					-- get the class details of the classes
 					-- boom
 				*/
 				classlistsModel.find({}).then(function() {
 	 					classlistsModel.countDocuments({}, function( err, count){ // counts num of classes
					    console.log( "Number of classes:", count );
					    var classcount = count;
					    var classIDs = [];

					    for(i = 0; i < classcount-1; i++) { // puts all classIDs that is handled by logged in trainer into an array
					    	if(classlistsModel.trainerID === req.session.user.userID) {
					    		//classIDs[i].push(classlistsModel.classID);
					    		// {$push: {classIDs: "hey"}};
									//{$push: {classIDs: classlistsModel.classID}};
									var classdump = classlistsModel.classID;
									classIDs.push(classdump);
					    		console.log(classIDs); // print laman ng array
					    	}
					    }

					    // matches id
					    var cList = JSON.parse(JSON.stringify(classIDs));
					    // let details = cList.map((item, i) => Object.assign({}, item, cList[i].classID));

					    res.render('trainer-profile', {
			 				fullName: req.session.user.lastName + ", " + req.session.user.firstName,
			 				uType: req.session.user.userType,
			 				// classDet: details
			 			});
					});
 				});
	 		}
 			else {
 				res.render('trainee-profile', {
	 				fullName: req.session.user.lastName + ", " + req.session.user.firstName,
	 				uType: req.session.user.userType
	 			});
 			}
 		}	
 		else res.redirect('login');
 	},

 	getDashboard: function(req, res, next) {
 		if (req.session.user) {
 			res.render('dashboard', {
 				fullName: req.session.user.lastName + ", " + req.session.user.firstName,
	 			uType: req.session.user.userType

	 			// class details 
 			});
 		}
 		else res.redirect('login');
 	},

 	getCreateClass: function(req, res, next) {
 		if (req.session.user) {
 			res.render('create-class', {
 				//boom
 			});
 		}
 		else res.redirect('login');
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

 	postLogout: function(req, res) {
		req.session.destroy();
		res.redirect("login");
	},

	// for encrypting
	postRegister: async function(req, res, next) {
	//	console.log(req.body);
		// users
		try {
			let hash = await bcrypt.hash(req.body.password, saltRounds);
			console.log(hash);
			let insert = await db.insertOne(usersModel,
				{userType: req.body.userType, firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, password: hash, deactivated: false});
			console.log(insert);
		} catch(e) {
			console.log(e);
		}
		// verification test...
	},

	getClientsList: function(req, res, next) {
		if (req.session.user){
			res.redirect('/');
		} else {
			res.render('clientlist', {
			});
		}
	 }
};

module.exports = rendFunctions;