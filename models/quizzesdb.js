const mongoose = require('mongoose');

var quizzesSchema = new mongoose.Schema({
	quizID: String,
	classID: String,
	quizDate: Date,
	startTime: Date,
	endTime: Date,
	numTakes: Number,
	numItems: Number
}, {collection: "quizzes"});

modules.export = mongoose.model("quizzes", quizzesSchema);