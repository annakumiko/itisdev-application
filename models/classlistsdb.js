const mongoose = require('mongoose');

var classlistsSchema = new mongoose.Schema({
	trainerID: String,
	classID: String
}, {collection: "classlists"});

module.exports = mongoose.model("classlists", classlistsSchema);