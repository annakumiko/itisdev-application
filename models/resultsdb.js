const mongoose = require('mongoose');

var resultsSchema = new mongoose.Schema({
	quizID: String,
	traineeID: String,
	quizScore: Number
}, {collection: "results"});

modules.export = mongoose.model("results", resultsSchema);