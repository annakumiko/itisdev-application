const mongoose = require('mongoose');

var skillassessmentsSchema = new mongoose.Schema({
	skillID: String,
	classID: String,
	traineeID: String,
	date: Date,
	skillScore: String,
}, {collection: "skillassessments"});

module.exports = mongoose.model("skillassessments", skillassessmentsSchema);