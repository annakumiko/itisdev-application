const mongoose = require('mongoose');

var classlistsSchema = new mongoose.Schema({
	trainerID: String,
	classID: String
}, {collection: "classlists"});

modules.export = mongoose.model("classlists", classlistsSchema);