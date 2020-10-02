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
const { countDocuments } = require('../models/classesdb');

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

// constructor for traineelists
function addTrainee(classID, traineeID) {
	var tempList = {
		classID: classID,
		traineeID: traineeID
	};

	return tempList;
}

// constructor for classlists
function createClassList(trainerID, classID) {
	var tempList = {
		trainerID: trainerID,
		classID: classID
	};

	return tempList;
}

// constructor for skillassessments
function createAssessment(skillID, classID, traineeID, date, skillScore) {
	var tempAssessment = {
		skillID: skillID,
		classID: classID,
		traineeID: traineeID,
		date: date,
		skillScore: skillScore
	}

	return tempAssessment;
}

// constructor for quiz
function createQuiz(quizid, classid, date, stime, etime, nTakes, nItems) {
	var tempQuiz = {
		quizID: quizid,
		classID: classid,
		quizDate: date,
		startTime: stime,
		endTime: etime,
		numTakes: nTakes,
		numItems: nItems
	}

	return tempQuiz;
}

// constructor for items
function createItem(itemNo, quizid, q, a) {
	var tempItem = {
		itemNo: itemNo,
		quizID: quizid,
		question: q,
		answer: a
	}

	return tempItem;
}

function quizTemp(traineeID, quizID, classID, quizDate, startTime, endDate, numTakes, numItems, quizScore){
	var temp = {
		traineeID: traineeID,
		quizID: quizID,
		classID: classID,
		quizDate: quizDate,
		startTime: startTime,
		endDate: endDate, 
		numItems: numItems,
		numTakes: numTakes,
		quizScore: quizScore,
	}

	return temp;
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

// get date selected dropdown
function getDateSelected(startDate, endDate, day) {
	var dateArray = new Array();
    var sDate = new Date(startDate);
    var eDate = new Date(endDate);
    var ind = day.slice(-1);

    while (sDate <= eDate) {
        dateArray.push(new Date (sDate));
        sDate = sDate.addDays(1);
    }

 //   console.log(dateArray);

    return dateArray[ind-1];
}

function addClient(clientID, clientName, companyName, email, contactNo, isActive) {
	var newClient = {
		clientID: clientID,
		clientName: clientName,
		companyName: companyName,
		email: email,
		contactNo: contactNo,
		isActive: isActive
	};

	return newClient;
}

function addCode(verifyCode, email) {
	var newCode = {
		verifyCode: verifyCode,
		email: email,
	};

	return newCode;
}

// two digits
function n(n) {
    return n > 9 ? "" + n: "0" + n;
}

// format date
function formatDate(date) {
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

function formatNiceDate(date) {
	var newDate = new Date(date);
	// adjust 0 before single digit date
	let day = ("0" + newDate.getDate()).slice(-2);

	// current month
	let month = ("0" + (newDate.getMonth() + 1)).slice(-2);

	// current year
	let year = newDate.getFullYear();

	return year + "-" + month + "-" + day;
}

//format time
function formatTime(time) {
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

function generateVerificationCode() {
	var verifyCode = "";

	for (var i = 0; i < 6; i++)
		verifyCode += (Math.round(Math.random() * 10)).toString();

	return verifyCode;
}

// computations
function computeSkill(s) {
	// compute skills
	var skillSum = 0;
	for(var i = 0; i < s.length; i++) {
		skillSum += parseInt(s[i]);
	}

					// average/total * 100
	var skillAve = Number(Math.round((skillSum/s.length) + "e2") + "e-2");
	
	console.log(skillAve);
	return skillAve;
}

function computeFinal(s, q) {

	var skillFinal = computeSkill(s)/10 * 100 * 0.6;

	// compute quizzes
	var qSum = 0;
	for(var i = 0; i < q.length; i++) {
		qSum += Number(q[i]);
	}

	var quizFinal = (qSum/q.length) * 0.4;

	//console.log(skillFinal);
	//console.log(quizFinal);

	var finalGrade = skillFinal + quizFinal;
	//console.log(finalGrade)

	return finalGrade;
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
		// console.log(user.userID);
		// SEARCH USER IN DB
		try {
			if (!user) // USER NOT IN DB
				res.send({status: 401});
			else { // SUCCESS
				if(user.isVerified){ //user able to login IF verified
					if(!user.deactivated){ //user able to login IF NOT deactivated
						bcrypt.compare(password, user.password, function(err, match) {
								if (match){
									req.session.user = user;
									res.send({status: 200});
								} else
									res.send({status: 401});
						}); //hanggang d2
					}
					else res.send({status: 410});
				}
				else{
					res.send({status: 409});
				}
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
		res.render('verification', {
			});
	},

	postVerification: async function(req, res, next) {
		let { email } = req.body;
		
		var user = await db.findOne(usersModel, {email: email, isVerified: false});

		if(!user){ // account already verified
			res.send({status: 409});
		}
		else{ // not verified
			// generate code
			var verifyCode = generateVerificationCode();
			var code = await db.findOne(verificationModel, { email: email });
			
			if(code){ // user has code (will be updated)
				verificationModel.findOneAndUpdate(
					{email: email},
					{ $set: { verifyCode: verifyCode }},
					{ useFindAndModify: false},
					function(err, match) {
						if (err) {
							res.send({status: 500});
						}
				});
			}
			else { // does not have code yet (will add to db)
				var data = addCode(verifyCode, email);

				verificationModel.create(data, function(error) {
					if (error) {
						res.send({status: 500});
					}
				})
			}				
			
			// var dump = await db.findOne(verificationModel, {email: email });
			// console.log(dump);

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
				subject: 'Verification Code',
				// text: emailText,
				html: `<p>Greetings! Here is your code: ${verifyCode}</p> <br> <br> <img src="cid:signature"/>`,
				attachments: [{
						filename: 'TVH.png',
						path: __dirname+'/TVH.png',
						cid: 'signature' //same cid value as in the html img src
				}]
			};

			smtpTransport.sendMail(mailOptions, function(error) {
				if (error){
					res.send({status: 500});
					console.log(error);
				}
				else{
					res.send({status: 200});
				} 

				smtpTransport.close();
			});
		}
	},

	getVerifyAccount: function(req, res, next) {
		// if user not verified..
		
		res.render('verify-account', {
			});
	},

	postVerifyAccount: async function(req, res, next) { // nde pumamasok d2 wat
		let { email, verifyCode } = req.body;
		var vCode = await db.findOne(verificationModel, {verifyCode: verifyCode});
		console.log(vCode);

		try {
			if (!vCode) { 
				res.send({status: 401}) 
			}
			else {
				// bcrypt.compare(email, vCode.email, function(err, match) {
				verificationModel.findOne({email: vCode.email, verifyCode: vCode.verifyCode}, function(err, match){
					if (match) {
						// console.log("hello");
						match.remove(); // remove from verificationModel

						usersModel.findOneAndUpdate( // update verified status
							{email: email},
							{ $set: { isVerified: true }},
							{ useFindAndModify: false},
							function(err, match) {
								if (err) {
									res.send({status: 500});
								}
							});

						console.log("User verified!");
					}
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
					sDate = formatDate(classVar[i].classList.startDate);
					eDate = formatDate(classVar[i].classList.endDate);

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
				sDate = formatDate(classVar[i].classList.startDate);
				eDate = formatDate(classVar[i].classList.endDate);
				sTime = formatTime(classVar[i].classList.startTime);
				eTime = formatTime(classVar[i].classList.endTime);

				classVar[i].classList.startDate = sDate;
				classVar[i].classList.endDate = eDate;
				classVar[i].classList.startTime = sTime;
				classVar[i].classList.endTime = eTime;
			}


 			res.render('dashboard', {
 				fullName: req.session.user.lastName + ", " + req.session.user.firstName,
	 			uType: req.session.user.userType,
	 			classes: classVar
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

 		console.log("Deteted " + classNum);
 		//try {
 			classesModel.findOne({classID: classNum}, function(err, cmatch) {
				if (err) {
					res.send({status: 500, mssg:'Server Error: Query not found.'});
				}			
				else {
					cmatch.remove(); // remove from classes

					// remove from trainer "array"
					classlistsModel.findOne({classID: classNum, trainerID: req.session.user.userID}, function(err, trmatch) {
						if (err) {
							res.send({status: 500, mssg:'SERVER ERROR: Cannot update classlist in DB.'});
						}
						else {
							trmatch.remove();	

							// remove from trainee "array"
							traineelistsModel.find({classID: classNum}, function(err, tematch) {
								if(err) {
									res.send({status: 500, mssg:'SERVER ERROR: Cannot update classlist in DB.'});
								} else {
									tematch.remove();
									res.send({status: 200, mssg: 'Deleted Class Successfully!'});
								}
							});
						}
					});
				}
			});
 		// }
 		// catch(e) {
 		// 	console.log(e);
 		// }
 		
 	},

 	getAddTrainees: async function(req, res, next) {
 		// console.log(req.params.course);
 		if(req.session.user) {
 			if(req.session.user.userType === "Trainer") {	
 				var classSelected = await classesModel.findOne({section: req.params.section});
 				var classID = classSelected.classID;		
 				
 				// all trainees
 				var trainees = await usersModel.find({userType: "Trainee"});

 				// trainees already in the class
 				var classTrainees = await traineelistsModel.find({classID: classID});

 				// trainees already in the class - details
 				var addedTrainees = [];
				for(var i = 0; i < classTrainees.length; i++) {
					addedTrainees[i] = await usersModel.findOne({userID: classTrainees[i].traineeID});
				}

				// endorsed trainees
					// 1. get ids
				var atIDs = [];
				for(var i = 0; i < addedTrainees.length; i++) {
					atIDs.push(addedTrainees[i].userID);
				}

				var tIDs = [];
				for(var i = 0; i < trainees.length; i++) {
					tIDs.push(trainees[i].userID);
				}

					// 2. check if exising in addedTrainees
				var endorsedIDs = tIDs.filter(r=> !atIDs.includes(r));

					// 3. get details
				var endorsedTrainees = [];
				for(var i = 0; i < endorsedIDs.length; i++) {
					endorsedTrainees[i] = await usersModel.findOne({userID: endorsedIDs[i]});
				}

				var endorsed = JSON.parse(JSON.stringify(endorsedTrainees));
				var added = JSON.parse(JSON.stringify(addedTrainees));
				
				// render
 		 		res.render('add-trainees', {
 		 			endorsed: endorsed,
 		 			added: added,
 		 			section: req.params.section,
 		 			course: req.params.course
 		 		});
 			}
 			else res.redirect('/');		
 		} else res.redirect('/login');
 	},

 	
 	postAddTrainees: async function(req, res, next) {
 		let { traineeID, section } = req.body;

 		var classSelected = await classesModel.findOne({section: section});
 		var classID = classSelected.classID;
 		console.log(classID);
 		// add
 		var a = addTrainee(classID, traineeID);

 		var trainee = await usersModel.findOne({userID: traineeID});
 			// put into traineelistsModel
 		traineelistsModel.create(a, function(error) {
		 			if (error) {
		 				res.send({status: 500, mssg: "Error: Cannot add trainee."});
		 				console.log("add-trainee error: " + error);
		 			}
		 			else res.send({status: 200, mssg: JSON.stringify(trainee)});
		 		});		
 	},

 	postRemoveTrainee: async function(req, res, next) {
 		let { traineeID, section } = req.body;

 		var classSelected = await classesModel.findOne({section: section});
 		var classID = classSelected.classID;

 		var trainee = await usersModel.findOne({userID: traineeID});
 		// where do i remove -> traineelistsModel only
 		traineelistsModel.findOne({traineeID: traineeID, classID: classID}, function(err, match) {
			if (err) {
				res.send({status: 500, mssg:'Server Error: Query not found.'});
			}			
			else {
				match.remove(); // remove from classes
				res.send({status: 200, mssg: JSON.stringify(trainee)});
			}
		});
 	},

 	getQuizList: async function(req, res, next) {
 		if(req.session.user) {
 			if(req.session.user.userType === "Trainer") {

 				var quizzes = await quizzesModel.aggregate([
					 {$lookup: {
							from: "classes",
							localField: "classID",
							foreignField: "classID",
							as: "quizList" // SLICE
					 }},
					 {$unwind: "$quizList"},
				]);		

 				for(var i = 0; i < quizzes.length; i++) {
 					quizzes[i].quizDate = formatDate(quizzes[i].quizDate);
 					quizzes[i].startTime = formatTime(quizzes[i].startTime);
 					quizzes[i].endTime = formatTime(quizzes[i].endTime);
 				}
				
				// get the items

 				res.render('quizlist', {
 					quizzes: quizzes
 				});

 			} else res.redirect('/');
 		} else res.redirect('login');
 		
 	},

 	getCreateQuiz: async function(req, res, next) {
 		if(req.session.user) {
 			if(req.session.user.userType === "Trainer") {
 				var userID = req.session.user.userID;

 				// date today
 				var date = new Date();
 				var dateToday = formatDate(date);

 				// classes
 				var classes = await classesModel.find({trainerID: userID});
 				var trainerClasses = JSON.parse(JSON.stringify(classes));

 				// items
 				var items = [{
 					question: "",
 					answer: ""
 				}];

 				var qItems = JSON.parse(JSON.stringify(items));
 			//	console.log(qItems);

 				res.render('create-quiz', {
 					//date: dateToday,
 					classes: trainerClasses,
 					secSelected: trainerClasses[0].section,
 					items: qItems,
 					pageName: "Create"
 				});		
 			} else res.redirect('/');
 		} else res.redirect('/login');
 	},

 	postCreateQuiz: async function(req, res, next) {
 		let { section, quizDate, startTime, endTime, numTakes, numItems, qArr, ansArr } = req.body;

 		// generate quizid
 		var quizID = generateQuizID();

 		// get classid
 		var classSelected = await db.findOne(classesModel, {section: section});
 		var classID = classSelected.classID;

 		var sTime = new Date("Jan 01 2020 " + startTime + ":00"),
 			eTime = new Date("Jan 01 2020 " + endTime + ":00");

 		var quiz = createQuiz(quizID, classID, quizDate, sTime, eTime, numTakes, numItems);

 		//insert to quizzesdb
 		var qInsert = quizzesModel.create(quiz, function(err) {
 			if(err) {
 				console.log(err);
 				res.send({status: 500, mssg: "Server Error: Cannot create quiz."});
 			}	
 			else {
 				for(var i = 0; i < numItems; i++) {
		 			var itemNo = "ITEM" + (i+1);
		 			var item = createItem(itemNo, quizID, qArr[i], ansArr[i]);
					var itemInsert = itemsModel.create(item, function(err) {
						if(err) 
							console.log(err);
					});
				}

				res.send({status: 200, mssg: "Quiz created!"});
 			}
 		});
 	},

 	getUpdateQuiz: async function(req, res, next) {
 		if(req.session.user) {
 			if(req.session.user.userType === "Trainer") {
 				var userID = req.session.user.userID;

 				// classes
 				var classes = await classesModel.find({trainerID: userID});
 				var trainerClasses = JSON.parse(JSON.stringify(classes));

 				// date
 				var qDate = formatNiceDate(req.params.qDate);

 				// get items
 				var qID = req.params.quizID;
 				var items = await itemsModel.find({quizID: qID});
 				var quizItems = JSON.parse(JSON.stringify(items));

 				res.render('create-quiz', {
 						qID: qID,
 						quizDate: qDate,
 						secSelected: req.params.section,
 						sTime: req.params.sTime,
 						eTime: req.params.eTime,
 						nTakes: req.params.nTakes,
 						classes: trainerClasses,
 						items: quizItems,
 						pageName: "Update"
 				});
 			} else res.redirect('/');
 		} else res.redirect('/login');
 	},

 	postUpdateQuiz: async function(req, res, next) {
 		let { qID, section, quizDate, startTime, endTime, numTakes, numItems, qArr, ansArr } = req.body;

 		// get classid
 		var classSelected = await db.findOne(classesModel, {section: section});
 		var classID = classSelected.classID;

 		var sTime = new Date("Jan 01 2020 " + startTime + ":00"),
 			eTime = new Date("Jan 01 2020 " + endTime + ":00");

 		//var quiz = createQuiz(quizID, classID, quizDate, sTime, eTime, numTakes, numItems);

 		//update
 		let qmodel = await quizzesModel.findOneAndUpdate(
			{ quizID: qID },
			{ $set: {
				classID: classID,
				quizDate: quizDate,
				startTime: sTime,
				endTime: eTime,
				numTakes: numTakes,
				numItems: numItems
			}},
			{ useFindAndModify: false },
				function(err, match) {
					if(err) {
						console.log(err);
						res.send({status: 500, mssg: "Server Error: Cannot update quiz."});
					}

				});
 		console.log(qmodel);

 		for(var i = 0; i < numItems; i++) {
			var itemNo = "ITEM" + (i+1);
			
			itemsModel.findOneAndUpdate(
				{ itemNo: itemNo, quizID: qID },
				{ $set: {
					question: qArr[i],
					answer: ansArr[i]
				}},
				{ useFindAndModify: false },
					function(err, match) {
						if(err) console.log(err);
				});
		}
		
		res.send({status: 200, mssg: "Quiz updated!"});
 	},

 	getScoresheets: async function(req, res, next) {
 		if(req.session.user) {
 			if(req.session.user.userType === "Trainer") {
 				// req.params
 				var sectionSelected = req.params.section;
 				var daySelected = req.params.day;

 				// get skills
 				var skills = await skilltypesModel.find({});
 				var skillTypes = JSON.parse(JSON.stringify(skills));

 				var userID = req.session.user.userID;

 				// get the classes of the trainer
 				var classes = await classesModel.find({trainerID: userID});

 				// set
 				if(sectionSelected === ':section') sectionSelected = classes[0].section;
 				else sectionSelected = req.params.section;

 				if(daySelected === ':day') daySelected = 'Day 1';
 				else daySelected = req.params.day;
 				
 				var trainerClasses = JSON.parse(JSON.stringify(classes));
 				var classSelected = await classesModel.findOne({section: sectionSelected}); // section selected
 				var classID = classSelected.classID;

				// get trainees class Selected
				var trainees = await traineelistsModel.aggregate([
					 {$match: {classID: classID}},
					 {$lookup: {
							from: "users",
							localField: "traineeID",
							foreignField: "userID",
							as: "traineeList" // SLICE
					 }},
					 {$unwind: "$traineeList"},
				]);		

				// get scores from day selected
				var dateSelected = getDateSelected(classSelected.startDate, classSelected.endDate, daySelected);
				var tscores = [];
				for (var i = 0; i < trainees.length; i++) {
					var scores = await skillassessmentsModel.find({classID: classID, date: dateSelected, traineeID: trainees[i].traineeID});
					var xscores = [];

					if(scores.length == 0) {
						for (var x = 0; x < 6; x++) {
							xscores[x] = "0";
						}
					}
					else {
						var traineescores = JSON.parse(JSON.stringify(scores));
					
						for (var x = 0; x < traineescores.length; x++) {
							xscores[x] = traineescores[x].skillScore;
						}
					}

					trainees[i].tscore = xscores;
					
				}

 				res.render('scoresheets', {
	 					skills: skillTypes,
	 					classes: trainerClasses,
	 					trainees: trainees,
	 					daySelected: daySelected,
	 					secSelected: sectionSelected,
	 					classSelected: classID,
	 					date: dateSelected,
	 					endDate: classSelected.endDate
 				});		
 			} else res.redirect('/');
 		} else res.redirect('/login');
 	},

 	postScoresheets: async function(req, res, next) {
 		let { classid, date, trainees, scores } = req.body;

 		var traineeInd = 0;
 		var scoreInd = 0;
 		var x = 0;
 		var y = 6;
 		var added = false;

 		do {
 			var a = 1;
 			for(var scoreInd = x; scoreInd < y; scoreInd++) {
 				var skillID = "skill" + (a);
 				var traineeID = trainees[traineeInd];
 				var skillScore = scores[scoreInd];
 				var traineeScore = createAssessment(skillID, classid, traineeID, date, skillScore);
 				
				// check if existing
				var existing = await skillassessmentsModel.findOne({skillID: skillID, classID: classid, traineeID: traineeID, date: date});
				console.log("existing");
				console.log(existing);
				// if not existing
				if(!existing) {
					// create
					skillassessmentsModel.create(traineeScore, function(err) {
					if (err) {
						console.log(err);
					}
					});
					console.log("create");
					console.log(traineeScore);
				}
				else {
					// update
					let tsUpdate = await skillassessmentsModel.findOneAndUpdate(
					{ skillID: skillID, classID: classid, traineeID: traineeID, date: date },
					{ $set: {
						skillScore: skillScore,
					}},
					{ useFindAndModify: false },
					function(err, match) {
						if(err) console.log(err);
					});
					console.log("update");
					console.log(tsUpdate);
				}
						
				a++;
 			}
 			traineeInd++;
 			x += 6;
 			y += 6;
 		} while (traineeInd != trainees.length);

 		if(traineeInd === trainees.length) 
 			res.send({status:200, mssg:"Scores updated!"});
 		else res.send({status: 500, mssg: "Server Error: Cannot update scores."});
 	},

 	getClassSummary: async function(req, res, next) {
 		if(req.session.user) {
 			if(req.session.user.userType === "Trainer") {
 				var userID = req.session.user.userID;
 				// get the classes of the trainer
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

 				var numStudents = [];
 				var dateToday = new Date();
 				for(var i = 0; i < classVar.length; i++) {
 					
					// num students
					var trainees = await traineelistsModel.find({classID: classVar[i].classID});
					classVar[i].numStudents = trainees.length;

					// passed/failed
					if(classVar[i].classList.endDate.valueOf() < dateToday.valueOf()) {
						var passed = 0, failed = 0;
						for(var j = 0; j < trainees.length; j++) {
							// get skill scores
							var tScores = [];
							var scores = await skillassessmentsModel.find({traineeID: trainees[j].traineeID, classID: classVar[i].classID});
							var strScores = JSON.parse(JSON.stringify(scores));

							for(var k = 0; k < scores.length; k++) {
								tScores[k] = (strScores[k].skillScore);
							}

							// console.log(tScores);
							// get quiz scores
							var qScores = ['100', '100', '100'];

							// compute
							var fg = computeFinal(tScores, qScores);
							
							//console.log(fg);
							if(fg > 80) passed++;
							else failed++;
						}
						classVar[i].ttlPass = passed;
						classVar[i].ttlFail = failed;
					}
					else {
						classVar[i].ttlPass = "N/A";
						classVar[i].ttlFail = "N/A";
					}
					

					// total quizzes
					var quizzes = await quizzesModel.find({classID: classVar[i].classID});
					classVar[i].numQuizzes = quizzes.length;

					// format date and time
					sDate = formatDate(classVar[i].classList.startDate);
					eDate = formatDate(classVar[i].classList.endDate);
					sTime = formatTime(classVar[i].classList.startTime);
					eTime = formatTime(classVar[i].classList.endTime);

					classVar[i].classList.startDate = sDate;
					classVar[i].classList.endDate = eDate;
					classVar[i].classList.startTime = sTime;
					classVar[i].classList.endTime = eTime;
				}

				var today = formatDate(dateToday);
				var time = formatTime(dateToday);
				
 				res.render('classes-summary', {
 					dateToday: today,
 					currTime: time,
 					classes: classVar
 				});

 			} else res.redirect('/');
 		} else res.redirect('/login');
 	},

 	getClassDetailed: async function(req, res, next) {
 		if(req.session.user) {
 			if(req.session.user.userType === "Trainer") {
 				var classID = req.params.classid;

 				// get trainees
 				var traineesVar = await traineelistsModel.aggregate([
					 {$match: {classID: classID}},
					 {$lookup: {
							from: "users",
							localField: "traineeID",
							foreignField: "userID",
							as: "trainees" // SLICE
					 }},
					 {$unwind: "$trainees"},
				]);
 				

 				for(var i = 0; i < traineesVar.length; i++) {
 					var tScores = [];
 					var scores = await skillassessmentsModel.find({traineeID: traineesVar[i].traineeID});
 					
 					for(var k = 0; k < scores.length; k++) {
 						tScores[k] = scores[k].skillScore;
 					}

 					var skillAve = computeSkill(tScores);
 					
 					traineesVar[i].skillAve = skillAve;
 				}

 				// get quizzes
 				var q = await quizzesModel.find({classID: classID});
 				var quizzes = JSON.parse(JSON.stringify(q));

 				for(var i = 0; i < quizzes.length; i++) {
 					quizzes[i].quizDate = formatDate(q[i].quizDate);
 				}

 				var today = formatDate(new Date());
 				var time = formatTime(new Date());

 				res.render('class-detailed', {
 					classID: classID,
 					trainees: traineesVar,
 					quizzes: quizzes,
 					dateToday: today,
 					currTime: time
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
				{userID: req.body.userID, userType: req.body.userType, firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, password: hash, deactivated: false, isVerified: true});
			console.log(insert);
		} catch(e) {
			console.log(e);
		}
	},

	getClientList: function(req, res, next) {
		if (req.session.user) {
			if(req.session.user.userType === "Trainee") {

				clientsModel.find({isActive: true}, function(err, data) {
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
				// console.log(userID);

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
					 {$unwind: "$course"},
			 ]);
			//  console.log(classVar);

			var skills = await skilltypesModel.find({});
			var skillTypes = JSON.parse(JSON.stringify(skills));
			// console.log(skillTypes);

			var skillScores = [];
			for (var i = 0; i < skillTypes.length; i++) {
				var data = await skillassessmentsModel.find({skillID: skillTypes[i].skillID, traineeID: userID});
				var dumpScores = JSON.parse(JSON.stringify(data));
				var scores = [];

				for(var x = 0; x < 8; x++)
					scores[x] = dumpScores[x].skillScore;
					
				skillTypes[i].skillScores = scores;
			}
			// console.log(skillTypes);

			// compute quizzes
			var quizList = [];
			
			// current trainee answers
			var TAdata = await traineeanswersModel.find({traineeID: userID});
			var tAnswers = JSON.parse(JSON.stringify(TAdata));
			
			// console.log(tAnswers[0].quizID);

			// getting only the quizIDs from the traineeanswers
			var arrQuizID = [tAnswers[0].quizID];
			var arrInd = 0;
			for(var i = 1; i < tAnswers.length; i++){
				if(tAnswers[i-1].quizID == tAnswers[i].quizID)
					arrInd++;
				else
					arrQuizID[arrInd] = tAnswers[i].quizID;
			}
			// console.log(arrQuizID);

			// removing empty items from array
			var quizIDs = arrQuizID.filter(function (el) {
				return el != null;
			});
			// console.log(quizIDs);

			// get quizzes that trainees answered
			for(var q = 0; q < quizIDs.length; q++){
				var qDump = await quizzesModel.find({quizID: quizIDs[q]});
				var quizDet = JSON.parse(JSON.stringify(qDump));
				
				var quizVar = quizTemp(userID, quizDet[0].quizID, quizDet[0].classID, quizDet[0].quizDate, quizDet[0].startTime, quizDet[0].endTime, quizDet[0].numTakes, quizDet[0].numItems)
				quizList[q] = quizVar;
				
			}
			// console.log(quizList);

			// comparing items to traineeAnswers
			for(var x = 0; x < quizList.length; x++){
				var quizScore = 0;
				var i = 0;

				var iTemp = await itemsModel.find({quizID: quizList[x].quizID});
				var numItems = JSON.parse(JSON.stringify(iTemp));
				// try{
					for(var y = 0; y < numItems.length; y++){
						var itemNo = "ITEM" + (i+1);

						var itTemp = await itemsModel.find({quizID: quizList[x].quizID, itemNo: itemNo});
						var item = JSON.parse(JSON.stringify(itTemp));

						var trTemp = await traineeanswersModel.find({traineeID: userID, quizID: quizList[x].quizID, itemNo: itemNo});
						var trAns = JSON.parse(JSON.stringify(trTemp));

						// console.log(item[0].answer)
						// console.log(trAns[0].tAnswer)
						for(var z = 0; z < trAns.length; z++){
							if(item[z].answer == trAns[z].tAnswer)
								quizScore++;
						}

						i++;
					}
				// } catch(e) {
				// console.log(e);}

				// console.log(quizScore);
					quizList[x].quizScore = quizScore;
			}

			console.log(quizList);

				res.render('view-grades', {
					fullName: req.session.user.lastName + ", " + req.session.user.firstName,
					section: classVar[0].classList.section,
					course: classVar[0].course.courseName,

					//SKILLS
					skills: skillTypes,

					//QUIZZES
					quizzes: quizList,
				});
			}
		} else {
			res.redirect('/')
		}
	 },

 	getTraineeSummary: async function(req, res, next) {
		if(req.session.user) {
			if(req.session.user.userType === "Admin") {
			
				var details = await usersModel.find({userType: "Trainee"})
				var trainees = JSON.parse(JSON.stringify(details));
	
				var clients = [];
				var numClients = 0;
				var dateToday = new Date();

				for(var i = 0; i < trainees.length; i++){
					// finding clients
					trainees[i].clients = await clientlistsModel.find({traineeID: trainees[i].userID});
					trainees[i].numClients = trainees[i].clients.length;

					var graduated = false;
					// setting class status
						// get classes
					var tClasses = await traineelistsModel.find({traineeID: trainees[i].userID});

					if(tClasses.length == 0)
						trainees[i].status = "Not started";
					else if(tClasses.length == 1) {
						trainees[i].status = "Ongoing";
						graduated = false;
					}
					else if(tClasses.length == 2) {
						for(var j = 0; j < tClasses.length; j++) {
						var classDet = await classesModel.find({classID: tClasses[j].classID});

							for(var k = 0; k < classDet; k++) {
								if(classDet[k].endDate.valueOf() > dateToday.valueOf()) {
									trainees[i].status = "Graduated";
									graudated = true;
								}
								else {
									trainees[i].status = "Ongoing";
									graduated = false;
								}
							}
						}					
					}
					else trainees[i].status = "Error";

					// getting final grade
						// get skills
					 if( graduated) {

						// final grade computation
						var tScores = [];
						var scores = await skillassessmentsModel.find({traineeID: trainees[i].userID});
	 					
	 					for(var k = 0; k < scores.length; k++) {
	 						tScores[k] = scores[k].skillScore;
	 					}

	 				//	console.log(tScores);
	 						// get quizzes
	 					var qScores = ['100', '100'];

	 					var fg = computeFinal(tScores, qScores);

	 					trainees[i].finalGrade = fg;
	 				 } 
	 				 else {
	 						trainees[i].finalGrade = "N/A";
	 				 }
				}
				
				var today = formatDate(new Date());
 				var time = formatTime(new Date());
				res.render('trainee-summary', {
					trainees: trainees,
					dateToday: today,
					currTime: time
				});
			} else res.redirect('/');
		} else res.redirect('/login');
	},

	getTraineeDetailed: async function(req, res, next) {
		if(req.session.user) {
			if(req.session.user.userType === "Admin") {
				var userID = req.params.userID;
				console.log(userID);
				
				var details = await usersModel.find({userID: userID});
				var user = JSON.parse(JSON.stringify(details));

				//classes
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
			 console.log(classVar);

			 // woPS
			 var trainer = '';
			 for(var x = 0; x < classVar.length; x++)
			 	classVar[x].trainer = await classesModel.find({trainerID: classVar[x].classList.trainerID});

				 console.log(classVar);

				//quizzes

				//skills
				var skills = await skilltypesModel.find({});
				var skillTypes = JSON.parse(JSON.stringify(skills));
				// console.log(skillTypes);
	
				var skillScores = [];
				for (var i = 0; i < skillTypes.length; i++) {
					var data = await skillassessmentsModel.find({skillID: skillTypes[i].skillID, traineeID: userID});
					var dumpScores = JSON.parse(JSON.stringify(data));
					var scores = [];
	
					for(var x = 0; x < 8; x++)
						scores[x] = dumpScores[x].skillScore;
						
					skillTypes[i].skillScores = scores;
				}

				//clients
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
				// console.log(clientsVar);

				var today = formatDate(new Date());
 				var time = formatTime(new Date());

				res.render('trainee-detailed', {
					userID: userID,
					fullName: user[0].lastName + ", " + user[0].firstName,
					classes: classVar,
					//quiz
					skills: skillTypes,
					clients: clientsVar,
					dateToday: today,
					currTime: time
				});		
			} else res.redirect('/');
		} else res.redirect('/login');
	},

	 getDefineCourse: function(req, res, next) {
		if (req.session.user) {
			if(req.session.user.userType === "Admin") {

				coursesModel.find({}, function(err, data) {
					var details = JSON.parse(JSON.stringify(data));
					var courseDet = details;	

					console.log(courseDet);

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
					// console.log(clients);

					res.render('manage-clientlist', {
					 clients: clients,
				 });
				});

		 } else res.redirect('login');
		}
		else res.redirect('login');
	 },

	 getUpdateClients: function(req, res, next) {
		if (req.session.user) {
			if(req.session.user.userType === "Admin") {

				clientsModel.find({}, function(err, data) {
					var details = JSON.parse(JSON.stringify(data));
					var clients = details;	
					// console.log(clients);

					res.render('update-clientlist', {
					 clients: clients,
				 });
				});

		 } else res.redirect('login');
		}
		else res.redirect('login');
	 },

	 postUpdateClients: async function(req, res, next) {
		let { clientID, clientName, companyName, email, contactNo, isActive } = req.body;

			for(var i = 0; i < clientID.length; i++){

				clientsModel.findOneAndUpdate(
					{ clientID: clientID[i] },
					{ $set: {
						clientName: clientName[i], companyName: companyName[i], email: email[i], contactNo: contactNo[i], isActive: isActive[i],
					}},
					{ useFindAndModify: false },
					function(err, match) {
						if(err){
							console.log(err);
						}
					})
			}

			if(i < clientID.length)
				res.send({status: 500, mssg: "Error in updating client details."})
			else 
				res.send({status: 200, mssg:"Client details updated successfully!"});
		},

	 postAddClient: function(req, res, next) {
		let { clientName, companyName, email, contactNo } = req.body;

		// console.log(clientName, companyName, email, contactNo);

		var clientID = generateClientID();		
		// console.log("clientID: " + clientID);
		var isActive = true;
		var client = addClient(clientID, clientName, companyName, email, contactNo, isActive)

		clientsModel.create(client, function(err){		
			if (err) {
				res.send({status: 500, mssg: "Error in adding new client."});
			}
			else{
				res.send({status: 200, mssg: "Client added!"});
			}
		})
	},

	postRemoveClient: function(req, res) {
		let { clientID } = req.body;
		
			clientsModel.findOne({clientID: clientID}, function(err, match) {
			 if (err) {
				 res.send({status: 500, mssg:'Error in removing client.'});
			 }			
			 else {
				 match.remove();
				 res.send({status: 200, mssg:'Client removed.'});
			 }
		 });
	},

	getDeactivateAccount: function(req, res, next) {
		if (req.session.user) {
			if(req.session.user.userType === "Trainee")
				res.render('deactivate-account', {
					userID: req.params.userID,
				});
			
			else res.redirect('login');
		}
		else res.redirect('login');
	 },
	 
	postDeactivateAccount: function(req, res) {
		let { password } = req.body;

		var userIDtemp = req.session.user.userID;

		bcrypt.compare(password, req.session.user.password, function(err, match) {
			if (!match)
				res.send({status: 401, mssg: 'Incorrect password.'});
			
			else{ //password matches
				usersModel.findOneAndUpdate(
						{userID: userIDtemp},
						{ $set: { deactivated: true }},
						{ useFindAndModify: false},
						function(err, match) {
							if (err) {
								res.send({status: 500, mssg:'There has been an error in deactivating your account.'});
							}
							else {
								traineelistsModel.findOne({traineeID: userIDtemp}, function(err, match) {
										if (err) {
											console.log(err);
										}
										else {
											match.remove();		
											console.log("Removed from class.")
										}
									});

									clientlistsModel.findOne({traineeID: userIDtemp}, function(err, match) {
										if (err) {
											console.log(err);
										}
										else {
											match.remove();		
											console.log("Removed from client.")
										}
									});

							// match.remove();
							res.send({status: 200, mssg:'Account deactivated succesfully.'});
					}
				});	
			}
		});
	},

}

module.exports = rendFunctions;