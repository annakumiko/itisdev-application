const mongoose = require('mongoose');

var resultsSchema = new mongoose.Schema({
	quizID: String,
	traineeID: String,
	quizScore: Number
}, {collection: "results"});

module.exports = mongoose.model("results", resultsSchema);