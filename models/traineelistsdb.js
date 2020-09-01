const mongoose = require('mongoose');

var traineelistsSchema = new mongoose.Schema({
	classID: String,
	traineeID: String
}, {collection: "traineelists"});

module.export = mongoose.model("traineelists", traineelistsSchema);