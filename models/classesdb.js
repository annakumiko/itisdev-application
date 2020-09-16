const mongoose = require('mongoose');

var classesSchema = new mongoose.Schema({
	classID: String, 
	courseID: String,
	trainerID: String, // discuss trainerID's future
	section : String,
	startDate: Date,
	endDate: Date,
	startTime: Date,
	endTime: Date
}, {collection: "classes"});

module.exports = mongoose.model("classes", classesSchema);