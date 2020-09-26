const mongoose = require('mongoose');

var skillassesmentsSchema = new mongoose.Schema({
	skillID: String,
	classID: String,
	traineeID: String,
	date: Date,
	skillScore: String,
}, {collection: "skillassesments"});

module.exports = mongoose.model("skillassesments", skillassesmentsSchema);