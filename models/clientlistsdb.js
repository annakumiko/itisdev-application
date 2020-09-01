const mongoose = require('mongoose');

var clientlistsSchema = new mongoose.Schema({
	traineeID: String,
	clientID: String
}, {collection: "clientlists"});

module.export = mongoose.model("clientlists", clientlistsSchema);