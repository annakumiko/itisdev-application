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

module.exports = mongoose.model("quizzes", quizzesSchema);