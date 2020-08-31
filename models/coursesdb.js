const mongoose = require('mongoose');

var coursesSchema = new mongoose.Schema({
	trainerID: String,
	classID: String
}, {collection: "courses"});

modules.export = mongoose.model("courses", coursesSchema);