const mongoose = require('mongoose');

var traineeanswersSchema = new mongoose.Schema({
	traineeID: String,
	itemNo: Number,
	tAnswer: String
}, {collection: "traineeanswers"});

module.export = mongoose.model("traineeanswers", traineeanswersSchema);