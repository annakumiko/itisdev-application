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

// constructor for class
function createClass(classID, courseID, trainerID, section, startDate, endDate, sTime, eTime) {
	var tempClass = {
		classID: classID,
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

function createClassList(trainerID, classID) {
	var tempList = {
		trainerID: trainerID,
		classID: classID
	};

	return tempList;
}


// two digits
function n(n) {
    return n > 9 ? "" + n: "0" + n;
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

//format time
function getTime(time) {
	var time = new Date(time);

	// console.log("time: " + time)

	var hh = n(time.getHours());
	var min = n(time.getMinutes());

	return hh + ":" + min; 
}

// generate section for class; numClass = no. of classes under the course
function generateSection(course, numClass){

	var newSec = "S0";

	if(course === "Real Estate") { //2
		newSec = 'R' + n(numClass + 1);
	}
	else {
		newSec = 'M' + n(numClass + 1);
	}
	
	return newSec;
}

//
function generateClassID() {
	var classID = "C";
	var idLength = 6;

	for (var i = 0; i < idLength; i++) {
		classID += (Math.round(Math.random() * 10)).toString();
	}

	return classID;
}

function generateQuizID() {
	var quizID = "Q";
	var idLength = 6;

	for (var i = 0; i < idLength; i++) {
		quizID += (Math.round(Math.random() * 10)).toString();
	}

	return quizID;
}

function generateClientID() {
	var clientID = "CL";
	var idLength = 5;

	for (var i = 0; i < idLength; i++) {
		clientID += (Math.round(Math.random() * 10)).toString();
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


				for(let i = 0; i < classVar.length; i++) {
					sDate = getDate(classVar[i].classList.startDate);
					eDate = getDate(classVar[i].classList.endDate);


					classVar[i].classList.startDate = sDate;
					classVar[i].classList.endDate = eDate;
				}

				// console.log(sArray);
				// console.log(classVar)
				 res.render('trainer-profile', {
					fullName: req.session.user.lastName + ", " + req.session.user.firstName,
					uType: req.session.user.userType,

					classes: classVar
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

 			// console.log("numclasses: " + classVar.length);
 			
			for(let i = 0; i < classVar.length; i++) {
				sDate = getDate(classVar[i].classList.startDate);
				eDate = getDate(classVar[i].classList.endDate);
				sTime = getTime(classVar[i].classList.startTime);
				eTime = getTime(classVar[i].classList.endTime);

				classVar[i].classList.startDate = sDate;
				classVar[i].classList.endDate = eDate;
				classVar[i].classList.startTime = sTime;
				classVar[i].classList.endTime = eTime;
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

 			var courseID = course.courseID;
 			// console.log(courseID); -- dis works

			classesModel.find({courseID: courseID}, function(err, classes) {//
 				var classVar = classes;
 				var numClass = classVar.length;
 				var trainerID = req.session.user.userID;
 				var sTime = new Date("Jan 01 2020 " + startTime + ":00");
 				var eTime = new Date("Jan 01 2020 " + endTime + ":00");
		 		console.log("numClass - " + numClass);

		 		var cName = null;
		 		if (courseID === "CO870081")
		 			cName = "Marketing";
		 		else cName = "Real Estate";

		 		console.log('course ' + cName);

				//generate classID
				var classID = generateClassID();
				console.log("ClassID : " + classID);

		 		// generate section
		 		var tempSec = generateSection(cName, numClass); // dis works
		 		console.log("tempSec " + tempSec);
		 		var sec = "S00";
		 		
		 		for (var i = 0; i < numClass; i++) {
		 			if (tempSec === classVar[i].section) // if equal ++
		 				tempSec = generateSection(cName, numClass+1); //sec = tempSec
		 			else sec = tempSec; // if not assign section 
		 		}

		 		console.log("section - " + sec);
		 		console.log("trainer - " + trainerID);
		 		console.log("startDate - " + startDate);
		 		console.log("sTime - " + sTime);
		 		
		 		// create the class
		 	  	var c = createClass(classID, courseID, trainerID, sec, startDate, endDate, sTime, eTime);
		 	  	var cl = createClassList(trainerID, classID);

		 		// put into classesModel
		 		classesModel.create(c, function(error) {
		 			if (error) {
		 				res.send({status: 500, mssg: "Error: Cannot create class."});
		 				console.log("create-class error: " + error);
		 			}
		 			else res.send({status: 200, mssg: 'Class created!'});
		 		});

		 		// put into classlistsModel
		 		classlistsModel.create(cl, function(error) {
		 			if (error) {
		 				res.send({status: 500, mssg: "Error: Cannot create class."});
		 				console.log("classlist error: " + error);
		 			}
		 			else next();
		 		});


 			});
		});
 	},

 	postDeleteClass: function(req, res) {
 		let { classNum } = req.body;

 		console.log(classNum);
 		try {
 			classesModel.findOne({classID: classNum}, function(err, match) {
				if (err) {
					res.send({status: 500, mssg:'Server Error: Query not found.'});
				}			
				else {
					match.remove(); // remove from classes

					classlistsModel.findOne({classID: classNum, trainerID: req.session.user.userID}, function(err, match) {
						if (err) {
							res.send({status: 500, mssg:'SERVER ERROR: Cannot update classlist in DB.'});
						}
						else {
							match.remove();		
							res.send({status: 200, mssg: 'Deleted Class Successfully!'});
						}
					});
				}
			});
 		}
 		catch(e) {
 			console.log(e);
 		}
 		
 	},

 	getAddTrainees: async function(req, res, next) {
 		console.log(req.params.course);
 		if(req.session.user) {
 			if(req.session.user.userType === "Trainer") {
 				/*
 		 			1. get class (section) and course of selected class // display
 					2. get trainees // sana -> who have not taken the course // 
 					3. get trainees already in the class
 				*/
 	
 				var trainees = await usersModel.aggregate([
					 {$match: {userType: "Trainee"}},
					 {$lookup: {
							from: "users",
							localField: "userID",
							foreignField: "userID",
							as: "traineeList" // SLICE
					 }},
					 {$unwind: "$traineeList"}
				]);

 		 		res.render('add-trainees', {
 		 			trainees: trainees,
 		 			//other sss
 		 			section: req.params.section,
 		 			course: req.params.course
 		 		});
 			}
 			else res.redirect('/');		
 		} else res.redirect('/login');
 	},

 	
 	postAddTrainees: function(req, res, next) {
 		// add


 		// remove
 	},

 	getQuizList: function(req, res, next) {
 		if(req.session.user) {
 			if(req.session.user.userType === "Trainer") {
 				res.render('quizlist', {

 				});		
 			} else res.redirect('/');
 		} else res.redirect('/login');
 		
 	},

 	getCreateQuiz: function(req, res, next) {
 		if(req.session.user) {
 			if(req.session.user.userType === "Trainer") {
 				res.render('create-quiz', {

 				});		
 			} else res.redirect('/');
 		} else res.redirect('/login');
 	},

 	getUpdateScoresheet: function(req, res, next) {
 		if(req.session.user) {
 			if(req.session.user.userType === "Trainer") {
 				res.render('update-scoresheet', {

 				});		
 			} else res.redirect('/');
 		} else res.redirect('/login');
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
					// console.log(clients);
					
					res.render('clientlist', {
					 clients: clients,
				 });
				});

		 } else res.redirect('login');
		}
		else res.redirect('login');
	 },

	getContactClient: function(req, res, next) {
		if (req.session.user) {
			if(req.session.user.userType === "Trainee") {

				clientsModel.find({}, function(err, data) {
					var details = JSON.parse(JSON.stringify(data));
					var clients = details;	
					// console.log(clients);
					
					res.render('contact-client', {
					 email: req.params.email,
					 companyName: req.params.companyName,
					 fullName: req.session.user.lastName + ", " + req.session.user.firstName
				 });
				});

		 } else res.redirect('login');
		}
		else res.redirect('login');
	 },

	postContactClient: function(req, res, next) {
		let { email, emailText } = req.body; // pass client email, email subject, and message
		
		//var userID = req.session.user.userID;
		var fullName = req.session.user.lastName + ", " + req.session.user.firstName;

			console.log("for : " + email,);
			console.log("messsage : " + emailText);

			// send email
			var smtpTransport = nodemailer.createTransport({
				service: 'Gmail',
				auth: {
					user: 'training.tvh@gmail.com',
					pass: 'tvhtraining'
				}
			});

			// content
			var mailOptions = {
				from: 'training.tvh@gmail.com',
				to: email,
				subject: '[REQUEST FOR INTERVIEW] ' + fullName,
				// text: emailText,
				html: `<p>${emailText}</p> <br> <br> <img src="cid:signature"/>`,
				attachments: [{
						filename: 'TVH.png',
						path: __dirname+'/TVH.png',
						cid: 'signature' //same cid value as in the html img src
				}]
				// attachments: [
				// 	{   // filename of CV
				// 			filename: '\assets\img\TVH.png'
				// 	},]
			};

			smtpTransport.sendMail(mailOptions, function(error) {
				if (error){
					res.send({status: 500, mssg: "There has been an error in sending the email."});
					console.log(error);
				}
				else{
					res.send({status: 200, mssg: "Email sent succesfully!"});
					console.log("sent");
				} 

				smtpTransport.close();
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