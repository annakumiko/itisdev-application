const mongoose = require('mongoose');

var trainersSchema = new mongoose.Schema({
	trainerID: String
}, {collection: "trainers"});

module.exports = mongoose.model("trainers", trainersSchema);