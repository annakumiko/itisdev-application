const mongoose = require('mongoose');

var traineesSchema = new mongoose.Schema({
	traineeID: String
}, {collection: "trainees"});

modules.export = mongoose.model("trainees", traineesSchema);