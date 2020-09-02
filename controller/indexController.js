/* DBs */
const classesModel = require('../models/classesdb');
const classlitsModel = require('../models/classlistsdb');
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

// main functions for getting and posting data
const rendFunctions = {
	/*
	getLogin: function(req, res, next) {
		var {email, password} = req.body;

		if (req.session.user){ 
			res.redirect('/'); 
		} else {
			res.render('login', { 
			});
		}
 	},

 	postLogin: async function(req, res, next) {
		let { email, password } = req.body;
		
		var student = await studentModel.findOne({email: email});
		
		// searches for user in db
		try {
			if (!student) // 2. No users match with email-pass input
				res.send({status: 401});
			else { // log-in success
				bcrypt.compare(password, student.password, function(err, match) {
					if (match){
						req.session.user = student;
						res.send({status: 200});						
					} else
						res.send({status: 401});
				});
			}		
		} catch(e) { // 1. Server error
			res.send({status: 500});
		}
	},

 	postLogout: function(req, res, next) {
		req.session.destroy();
		res.redirect("/");
	}
	*/
}

// module.exports = rendFunctions;