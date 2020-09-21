const bcrypt = require('bcrypt');
const saltRounds = 10;
const nodemailer = require('nodemailer'); //for sending emails

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

/* EMAIL */
// let transport = nodemailer.createTransport(options[, defaults]);
let transport = nodemailer.createTransport({
	auth: {
		 user: 'put_your_username_here',
		 pass: 'put_your_password_here'
	}
});

// constructor for class
function createClass(courseID, trainerID, section, startDate, endDate, sTime, eTime) {
	var tempClass = {
		courseID: courseID,
		trainerID: trainerID,
		section: section,
		startDate: startDate,
		endDate: endDate,
		startTime: sTime,
		endTime: eTime
	};

	return tempClass;
}
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

// two digits
function n(n) {
    return n > 9 ? "" + n: "0" + n;
}

// generate section for class; numClass = no. of classes under the course
function generateSection(course, numClass){

	var newSec = "S0";

	if(course === "Real Estate") {
		for (var i = 0; i < numClass; i++) {
			newSec = 'R' + n(i + 1);
		}
	}
	else {
		for (var i = 0; i < numClass; i++) {
			newSec = 'M' + n(i + 1);
		}
	}
	
	return newSec;
}

//
function generateClassID() {
	var classID = "C";
	var idLength = 7;

	for (var i = 0; i < idLength; i++) {
		classID += (Math.round(Math.random() * 10)).toString();
	}

	return classID;
}

function generateQuizID() {
	var quizID = "Q";
	var idLength = 8;

	for (var i = 0; i < idLength; i++) {
		quizID += Math.random().toString();
	}

	return quizID;
}

function generateClientID() {
	var clientID = "CL";
	var idLength = 8;

	for (var i = 0; i < idLength; i++) {
		clientID += Math.random().toString();
	}

	return clientID;
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
 				
				var userID = req.session.user.userID;
				 
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
 				var userID = req.session.user.userID;

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
 			var userID = req.session.user.userID;

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
		 			var userID = req.session.user.userID;

		 			//console.log(courseDet);	
	 				res.render('create-class', {
						courseList: courseDet
					});
		 		});

			} else res.redirect('login');
 		}
 		else res.redirect('login');
 	},


 	postCreateClass: function(req, res, next) {
 		let { course, startDate, endDate, startTime, endTime } = req.body;
 		
 		// count classes under course

 		coursesModel.findOne({courseName: course}, function(err, course) {

 			var courseID = course.courseID; // dis works

			classesModel.find({courseID: courseID}, function(err, classes) {//
 				var classVar = classes;
 				var numClass = classVar.length;
 				var trainerID = req.session.user.userID;
 				var sTime = new Date("Jan 01 2020 " + startTime + ":00");
 				var eTime = new Date("Jan 01 2020 " + endTime + ":00");
		 		console.log("numClass - " + numClass);

		 		var cName = null;
		 		if (courseID == "CO870081")
		 			cName = "Marketing";
		 		else cName = "Real Estate";

		 		console.log('course ' + cName);

				//generate classID
				var classID = generateClassID();
				console.log("ClassID : " + classID);

		 		// generate section
		 		var tempSec = generateSection(cName, numClass); // dis works
		 		console.log("tempSec " + tempSec);
		 		// var sec = "S00";
		 		
		 		for (var i = 0; i < numClass; i++) {
		 			if (tempSec === classVar[i].section) // if equal ++
		 				tempSec++; //sec = tempSec
		 			else var sec = tempSec; // if not assign section 
		 		}

		 		console.log("section - " + sec);
		 		console.log("trainer - " + trainerID);
		 		console.log("startDate - " + startDate);
		 		console.log("sTime - " + sTime);
		 		
		 		// create the class
		 	  var c = createClass(classID, courseID, trainerID, sec, startDate, endDate, sTime, eTime);

		 		// put into classesModel
		 		classesModel.create(c, function(error) {
		 			if (error) res.send({status: 500, mssg: "Error: Cannot create class."});
		 			else res.send({status: 200, mssg: 'Class created!'});
		 		});

 			});
		});
 	},

 	getAddTrainees: function(req, res, next) {
 		/*
 			1. get class (section) and course of selected class // display
			2. get endorsed trainees (trainees not belonging in a class yet)
			3. get trainees already in the class
		*/

		// kunin yung classes ni trainer -> array
 		res.render('add-trainees', {
 			
 		});
 	},

 	postAddTrainees: function(req, res, next) {
 		// add


 		// remove
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

	getClientList: function(req, res, next) {
		if (req.session.user) {
			if(req.session.user.userType === "Trainee") {

				clientsModel.find({}, function(err, data) {
					var details = JSON.parse(JSON.stringify(data));
					var clients = details;	
					console.log(clients);
					
					res.render('clientlist', {
					 clients: clients,
				 });
				});

		 } else res.redirect('login');
		}
		else res.redirect('login');
	 },

	postClientList: function(req, res, next) {
		let { email, emailsubject, emailText } = req.body; // pass client email, email subject, and message
		
		//var userID = req.session.user.userID;

			// send email
			var eTransport = nodemailer.createTransport({
				service: 'Gmail',
				auth: {
					user: req.session.user.userEmail,
					pass: req.session.user.password
				}
			});

			var mailOptions = {
				from: req.session.user.userEmail,
				to: email,
				subject: emailsubject,
				text: emailText,
			};

			console.log(email + " - " + emailsubject);

			eTransport.sendMail(mailOptions, function(error) {
				if (error) console.log(error);
				else console.log("sent");

				eTransport.close();
			});
	 },

	getViewGrades: async function(req, res, next) {
		if (req.session.user){
			if(req.session.user.userType === "Trainee") {
				var userID = req.session.user.userID;
				var classVar = await traineelistsModel.aggregate([
					{$match: {traineeID: userID}},
					{$lookup: {
						 from: "classes",
						 localField: "classID",
						 foreignField: "classID",
						 as: "classList"
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

			 // compute skills

			 //compute quizzes

				res.render('view-grades', {
					fullName: req.session.user.lastName + ", " + req.session.user.firstName,
					section: classVar[0].classList.section,
					course: classVar[0].course.courseName,

					//SKILLS

					//QUIZZES
				});
			}
		} else {
			res.redirect('/')
		}
	 },

	 getDefineCourse: function(req, res, next) {
		if (req.session.user) {
			if(req.session.user.userType === "Admin") {

				coursesModel.find({}, function(err, data) {
					var details = JSON.parse(JSON.stringify(data));
					var courseDet = details;	

					res.render('define-course', {
					 courseList: courseDet
				 });
				});

		 } else res.redirect('login');
		}
		else res.redirect('login');
	 },

	 postDefineCourse: function(req, res, next) {
		let { courseName, courseDesc } = req.body;

		console.log(courseName + " - " + courseDesc);

		coursesModel.findOneAndUpdate(
			{ courseName: courseName },
			{ $set: {
				courseDesc: courseDesc,
				//files
			}},
			{ useFindAndModify: false },
			function(err, match) {
				if (err) {
					res.send({status: 500, mssg: "Error in updating course."});
					console.log("Error in updating course");
				}
				else{
					res.send({status: 200, mssg: "Course updated."});
					console.log("Course updated.");
				}
		});
	},

	getManageClients: function(req, res, next) {
		if (req.session.user) {
			if(req.session.user.userType === "Admin") {

				clientsModel.find({}, function(err, data) {
					var details = JSON.parse(JSON.stringify(data));
					var clients = details;	
					console.log(clients);

					res.render('manage-clientlist', {
					 clients: clients,
				 });
				});

		 } else res.redirect('login');
		}
		else res.redirect('login');
	 },

}

module.exports = rendFunctions;