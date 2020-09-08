const mongoose = require('mongoose');

var clientlistsSchema = new mongoose.Schema({
	traineeID: String,
	clientID: String
}, {collection: "clientlists"});

module.exports = mongoose.model("clientlists", clientlistsSchema);