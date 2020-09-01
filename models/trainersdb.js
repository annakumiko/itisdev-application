const mongoose = require('mongoose');

var trainersSchema = new mongoose.Schema({
	trainerID: String
}, {collection: "trainers"});

module.export = mongoose.model("trainers", trainersSchema);