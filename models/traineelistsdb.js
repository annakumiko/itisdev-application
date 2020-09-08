const mongoose = require('mongoose');

var traineelistsSchema = new mongoose.Schema({
	classID: String,
	traineeID: String
}, {collection: "traineelists"});

module.exports = mongoose.model("traineelists", traineelistsSchema);