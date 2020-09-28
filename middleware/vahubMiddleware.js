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

function isOverlap (startDate1, endDate1, startDate2, endDate2, startTime1, endTime1, startTime2, endTime2) {
	var sTime1 = new Date("Jan 01 2020 " + startTime1 + ":00"),
		eTime1 = new Date("Jan 01 2020 " + endTime1 + ":00"),
		sDate1 = new Date(startDate1),
		eDate1 = new Date(endDate1),
		sTime1value = sTime1.valueOf(),
		eTime1value = eTime1.valueOf(),
		sTime2value = startTime2.valueOf(),
		eTime2value = endTime2.valueOf(),
		sDate1value = sDate1.valueOf(),
		eDate1value = eDate1.valueOf(),
		sDate2value = startDate2.valueOf(),
		eDate2value = endDate2.valueOf();
		overlap = true;
	
	 // console.log("starttime input - " + sTime1value);
	 // console.log("endtime input - " + eTime1value);
	 // console.log("starttime checking - " + sTime2value);
	 // console.log("endTime checking - " + eTime2value);

	 console.log("startdate input - " + sDate1value);
	 console.log("enddate input - " + eDate1value);
	 console.log("startdate checking - " + sDate2value);
	 console.log("enddate checking - " + eDate2value);

	// if dateOverlap -> check timeOverlap
	if((sDate1value <= eDate2value) && (sDate2value <= eDate2value)) {
		// if timeOverlap
  		if((sTime1value <= eTime2value) && (sTime2value <= eTime1value)) overlap = true;
  		else overlap = false;
	} // if !dateOverlap -> check timeOverlap
	else overlap = false;

	console.log("isOverlap - " + overlap);
	return overlap;
}

function isOngoing(eDate) {
	var endDate = new Date(eDate);
	var eDateValue = eDate.valueOf();
	var dateToday = new Date();
	var todayValue = dateToday.valueOf();

	if(eDateValue > todayValue)
		return true;
	else return false;
}

const vahubMiddleware = {

	validateCreateClass: async function (req, res, next) {
		var trainerID = JSON.parse(JSON.stringify(req.session.user.userID));

		let { startDate, endDate, startTime, endTime } = req.body; 

		let trainerClasses = await classesModel.find({trainerID: trainerID});
		var numClass = trainerClasses.length;
		var overlapSched = false;

		for(var i = 0; i < numClass; i++) {
			if(isOverlap(startDate, endDate, trainerClasses[i].startDate, trainerClasses[i].endDate, 
				startTime, endTime, trainerClasses[i].startTime, trainerClasses[i].endTime)) {
					overlapSched = true;
					console.log("trainer class start " + i + " - " + trainerClasses[i].startDate);
				}
		}

		console.log("overlap - " + overlapSched);

		if(overlapSched)
			res.send({status: 401, mssg: 'This class schedule overlaps with one of your classes.'});
		else return next();
	},

	
	validateAddTrainees: async function(req, res, next) {
		let { traineeID, section } = req.body;
		
		// 1. check if trainee already had a class with the course
			// get course ID
		var classSelected = await classesModel.findOne({section: section});
		var classID = classSelected.classID;
 		var courseID = classSelected.courseID;

			// get classes under the course
		var courseClasses = await classesModel.find({courseID: courseID});
		var cIDs = [];
		for(var i = 0; i < courseClasses.length; i++) {
			cIDs.push(courseClasses[i].classID);
		}


			// get trainee's classes
		var traineeClasses = await traineelistsModel.find({traineeID: traineeID});
		var tIDs = [];
		var tEndDates = [];
		for(var i = 0; i < traineeClasses.length; i++) {
			tIDs.push(traineeClasses[i].classID);
			tEndDates.push(traineeClasses[i].endDate);
		}

		var trainees = await traineelistsModel.find({classID: classID});
		var numTrainees = trainees.length;
		console.log(trainees);
		var existing = cIDs.some(r=> tIDs.includes(r));
		console.log(existing);

		// 2. check if trainee is in an ongoing class
		var ongoing = false;
		for(var i = 0; i < tEndDates.length; i++) {
			if(tEndDates[i] != null)
				ongoing = isOngoing(tEndDates[i]);
			else ongoing = false;
			console.log(tEndDates[i]);
		}
		
       
    	console.log(ongoing);
		if(numTrainees === 20)
			res.send({status: 401, mssg: 'This class already has 20 trainees.'});
		else if(ongoing || existing) 
			res.send({status: 401, mssg: 'This trainee is in an ongoing class or already took this course.'});
		else return next();
        
		
	},

	validateCreateQuiz: async function(req, res, next) {

	}	
}


module.exports = vahubMiddleware;