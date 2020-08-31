const mongoose = require('mongoose');

var traineelistsSchema = new mongoose.Schema({
	classID: String,
	traineeID: String
}, {collection: "traineelists"});

modules.export = mongoose.model("traineelists", traineelistsSchema);