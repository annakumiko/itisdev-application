const mongoose = require('mongoose');

var classesSchema = new mongoose.Schema({
	classID: String, /* under deliberatION */
	courseID: String,
	trainerID: String,
	startDate: Date,
	endDate: Date,
	startTime: Date,
	endTime: Date
}, {collection: "classes"});

module.export = mongoose.model("classes", classesSchema);