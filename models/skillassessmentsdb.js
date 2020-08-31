const mongoose = require('mongoose');

var skillassesmentsSchema = new mongoose.Schema({
	skillID: String,
	classID: String,
	traineeID: String,
	date: Date,
	skillScore: Number
}, {collection: "skillassesments"});

modules.export = mongoose.model("skillassesments", skillassesmentsSchema);