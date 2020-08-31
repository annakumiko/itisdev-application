const mongoose = require('mongoose');

var itemsSchema = new mongoose.Schema({
	itemNo: String,
	quizID: String,
	question: String,
	answer: String
}, {collection: "items"});

modules.export = mongoose.model("items", itemsSchema);