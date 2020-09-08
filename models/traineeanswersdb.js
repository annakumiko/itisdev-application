const mongoose = require('mongoose');

var traineeanswersSchema = new mongoose.Schema({
	traineeID: String,
	itemNo: Number,
	tAnswer: String
}, {collection: "traineeanswers"});

module.exports = mongoose.model("traineeanswers", traineeanswersSchema);