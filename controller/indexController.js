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
		console.log("get login");
		if (req.session.user){
			res.redirect('/');
		} else {
			res.render('login', {
			});
		}
 	},

 	getHome: function(req, res, next) {
		if (req.session.user) {

			console.log("get home");

			res.render('home', {
				loggedIn: true
			});
		}
 	},

 	postLogin: async function(req, res, next) {
		let { email, password } = req.body;
		console.log("BADUM user");

		var user = await db.findOne(usersModel, {email: email});

		console.log("MATCH user");
		// SEARCH USER IN DB
		try {
			if (!user) // USER NOT IN DB
				res.send({status: 401});
			else { // SUCCESS
				bcrypt.compare(password, user.password, function(err, match) {
					if (match){
						console.log("hello user");
						req.session.user = user;
						res.send({status: 200});
					} else
						res.send({status: 401});
				});
			}		
		} catch(e) {
			res.send({status: 500});
		}
		console.log("frick user");
	},

 	postLogout: function(req, res, next) {
		req.session.destroy();
		res.redirect("/login");
	}

}

module.exports = rendFunctions;