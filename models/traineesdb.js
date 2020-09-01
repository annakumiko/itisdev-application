const mongoose = require('mongoose');

var traineesSchema = new mongoose.Schema({
	traineeID: String
}, {collection: "trainees"});

module.export = mongoose.model("trainees", traineesSchema);