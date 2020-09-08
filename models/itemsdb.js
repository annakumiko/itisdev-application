const mongoose = require('mongoose');

var itemsSchema = new mongoose.Schema({
	itemNo: String,
	quizID: String,
	question: String,
	answer: String
}, {collection: "items"});

module.exports = mongoose.model("items", itemsSchema);