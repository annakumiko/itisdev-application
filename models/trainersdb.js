const mongoose = require('mongoose');

var trainersSchema = new mongoose.Schema({
	trainerID: String
}, {collection: "trainers"});

modules.export = mongoose.model("trainers", trainersSchema);