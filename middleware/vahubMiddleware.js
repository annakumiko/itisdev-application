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
	
/*
	TEST CASES
	1. same date same time = overlap - if (dateOverlap && timeOverlap) return true;
	2. same date different time 
		a. overlapping time = overlap if (dateOverlap && timeOverlap) return true;
		b. not overlapping if (dateOverlap && !timeOverlap) return false;
	3. different date different time = nop if (!dateOverlap && !timeOverlap) return false;
	4. different date same time = nop if (!dateOverlap && timeOverlap) return false;
	5. overlapping dates same time = overlap // #2
*/
	
	var sTime1 = new Date("Jan 01 2020 " + startTime1 + ":00");
	var eTime1 = new Date("Jan 01 2020 " + endTime1 + ":00");
	//var sTime2 = new Date("Jan 01 2020 " + startTime2 + ":00");
	//var eTime2 = new Date("Jan 01 2020 " + endTime2 + ":00");
	var overlap = false;
	console.log("starttime input - " + sTime1);
	console.log("endtime input - " + eTime1);

	// if dateOverlap -> check timeOverlap
	if((startDate1 <= endDate2) && (startDate2 <= endDate1)) {
		// if timeOverlap
  		if((sTime1 <= endTime2) && (startTime2 <= eTime1)) overlap = true;
  		else overlap = false;
	} // if !dateOverlap -> check timeOverlap
	else overlap = false;

	console.log("isOverlap - " + overlap);
	return overlap;
}

const vahubMiddleware = {

	validateCreateClass: async function (req, res, next) {
		// things
		var trainerID = JSON.parse(JSON.stringify(req.session.user._id));

		let { startDate, endDate, startTime, endTime } = req.body; 

		/*
			STEPS
			1. go through classes of trainer (assign to object, get numClass?)
			2. for each class, compare dates and timez (isOverlap(put everythin here))
			3. conditions
				a. if overlap = res.send({status: 401, mssg: 'This class schedule overlaps with one of your classes.'});
				b. else... return next(); ???
		*/

		let trainerClasses = await classesModel.find({trainerID: trainerID});
		var numClass = trainerClasses.length;
		var overlapSched = false;

		console.log(startDate + "-" + endDate);
		console.log(trainerClasses[0].startDate  + "-" + trainerClasses[0].endDate); 
		console.log(startTime  + "-" + endTime);
		console.log(trainerClasses[0].startTime + "-" + trainerClasses[0].endTime);

		for(var i = 0; i < numClass; i++) {
			if(isOverlap(startDate, endDate, trainerClasses[i].startDate, trainerClasses[i].endDate, 
				startTime, endTime, trainerClasses[i].startTime, trainerClasses[i].endTime))
					overlapSched = true;
		}

		console.log("overlap - " + overlapSched);

		if(overlapSched)
			res.send({status: 401, mssg: 'This class schedule overlaps with one of your classes.'});
		else return next();
	},

	/*
	validateAddTrainees: async function(req, res, next) {
		
		
		// check if trainee -- already had a class with the course
		// check if trainee -- in another active (ongoing)
	}	

	*/
}

module.exports = vahubMiddleware;