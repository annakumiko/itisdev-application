const mongoose = require('mongoose');

var coursesSchema = new mongoose.Schema({
	trainerID: String,
	classID: String,
	courseName : String,
}, {collection: "courses"});

module.export = mongoose.model("courses", coursesSchema);