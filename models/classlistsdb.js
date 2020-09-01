const mongoose = require('mongoose');

var classlistsSchema = new mongoose.Schema({
	trainerID: String,
	classID: String
}, {collection: "classlists"});

module.export = mongoose.model("classlists", classlistsSchema);