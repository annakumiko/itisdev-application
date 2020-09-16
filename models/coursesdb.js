const mongoose = require('mongoose');

var coursesSchema = new mongoose.Schema({
	trainerID: String,
	classID: String,
	courseID: String,
	courseName : String,
}, {collection: "courses"});

module.exports = mongoose.model("courses", coursesSchema);