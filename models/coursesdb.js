const mongoose = require('mongoose');

var coursesSchema = new mongoose.Schema({
	trainerID: String,
	classID: String,
	courseID: String,
	courseName : String,
	courseDesc: String,
	courseModules: String,
}, {collection: "courses"});

module.exports = mongoose.model("courses", coursesSchema);