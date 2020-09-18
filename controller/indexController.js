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
const usersModel = require('../models/usersdb');
const verificationModel = require('../models/verificationdb');
const db = require('../models/db');

// format date
function getDate(date) {
	var newDate = new Date(date);

	var mm = newDate.getMonth() + 1;
	switch(mm) {
		case 1: mm = "January"; break;
		case 2: mm = "February"; break;
		case 3: mm = "March"; break;
		case 4: mm = "April"; break;
		case 5: mm = "May"; break;
		case 6: mm = "June"; break;
		case 7: mm = "July"; break;
		case 8: mm = "August"; break;
		case 9: mm = "September"; break;
		case 10: mm = "October"; break;
		case 11: mm = "November"; break;
		case 12: mm = "December"; break;
	}

	var dd = newDate.getDate();
	var yy = newDate.getFullYear();

	return mm + " " + dd + ", " + yy;
}

// format time
function getTime(time) {
	return time;
}

// pass course here
function generateSection(section, numClass){

	var newSec = section;

	if(section === "Real Estate") {
		// R + numclass + 1
		// check if existing section... how
	}
	else {
		// M + numclass + 1
		// check if existing
	}

	return newSec;
}

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
 	getProfile: async function(req, res, next) {
 		if (req.session.user) {
			 // SEARCH LOGGED IN USER
			 // var idArray = [];
 			if (req.session.user.userType === "Trainer") {
 				
				var userID = req.session.user._id;
				 
				 var classVar = await classlistsModel.aggregate([
					 {$match: {trainerID: userID}},
					 {$lookup: {
							from: "classes",
							localField: "classID",
							foreignField: "classID",
							as: "classList" // SLICE
					 }},
					 {$unwind: "$classList"},
					 {$lookup: {
							from: "courses",
							localField: "classList.courseID",
							foreignField: "courseID",
							as: "course"
						}},
						{$unwind: "$course"}
				]);

				var sArray = [];
				var eArray = [];

				for(let i = 0; i < classVar.length; i++) {
					sDate = getDate(classVar[i].classList.startDate);
					eDate = getDate(classVar[i].classList.endDate);

					sArray.push(sDate);
					eArray.push(eDate);

					classVar[i].classList.startDate = sDate;
					classVar[i].classList.endDate = eDate;
				}

				// console.log(sArray);
				// console.log(classVar)
				 res.render('trainer-profile', {
					fullName: req.session.user.lastName + ", " + req.session.user.firstName,
					uType: req.session.user.userType,

					classes: classVar
					// courseName: classVar.classList.courseID,
					// startDate: classVar.classList.startDate,
					// endDate: classVar.classList.endDate,

				});
	 		}
 			else if (req.session.user.userType === "Trainee"){
 				var userID = req.session.user._id;

 				// class details - for trainees
 				var classVar = await traineelistsModel.aggregate([
					 {$match: {traineeID: userID}},
					 {$lookup: {
							from: "classes",
							localField: "classID",
							foreignField: "classID",
							as: "classList" // SLICE
					 }},
					 {$unwind: "$classList"},
					 {$lookup: {
							from: "courses",
							localField: "classList.courseID",
							foreignField: "courseID",
							as: "course"
						}},
						{$unwind: "$course"}
				]);
				 
 				// clients
 				var clientsVar = await clientlistsModel.aggregate([
 					{$match: {traineeID: userID}},
					 {$lookup: {
							from: "clients",
							localField: "clientID",
							foreignField: "clientID",
							as: "clientList" // SLICE
					 }},
					 {$unwind: "$clientList"}
 				]);

 				res.render('trainee-profile', {
	 				fullName: req.session.user.lastName + ", " + req.session.user.firstName,
					uType: req.session.user.userType,

					// classes: classVar,          
					section: classVar[0].classList.section,
					course: classVar[0].course.courseName,
					clients: clientsVar
	 			});
 			}
 			else {
 				res.redirect('/');
 			}
 		}	
 		else res.redirect('login');
 	},

 	getDashboard: async function(req, res, next) {
 		if (req.session.user) {
 			var userID = req.session.user._id;

 			var classVar = await classlistsModel.aggregate([
					 {$match: {trainerID: userID}},
					 {$lookup: {
							from: "classes",
							localField: "classID",
							foreignField: "classID",
							as: "classList" // SLICE
					 }},
					 {$unwind: "$classList"},
					 {$lookup: {
							from: "courses",
							localField: "classList.courseID",
							foreignField: "courseID",
							as: "course"
						}},
						{$unwind: "$course"}
				]);

 			var sArray = [];
			var eArray = [];

			for(let i = 0; i < classVar.length; i++) {
				sDate = getDate(classVar[i].classList.startDate);
				eDate = getDate(classVar[i].classList.endDate);

				sArray.push(sDate);
				eArray.push(eDate);

				classVar[i].classList.startDate = sDate;
				classVar[i].classList.endDate = eDate;
			}


 			res.render('dashboard', {
 				fullName: req.session.user.lastName + ", " + req.session.user.firstName,
	 			uType: req.session.user.userType,
	 			classes: classVar
	 			// class details 
 			});
 		}
 		else res.redirect('login');
 	},

 	getCreateClass: function(req, res, next) {
 		if (req.session.user) {
 			if(req.session.user.userType === "Trainer") {
	 			// courses
		 		coursesModel.find({}, function(err, data) {
		 			var details = JSON.parse(JSON.stringify(data));
		 			var courseDet = details;	
		 			var userID = req.session.user._id;

		 			//console.log(courseDet);	
	 				res.render('create-class', {
						courseList: courseDet
					});
		 		});

			} else res.redirect('login');
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

	// for encrypting / mimic register
	postRegister: async function(req, res, next) {
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