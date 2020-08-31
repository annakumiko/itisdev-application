const mongoose = require('mongoose');

var clientlistsSchema = new mongoose.Schema({
	traineeID: String,
	clientID: String
}, {collection: "clientlists"});

modules.export = mongoose.model("clientlists", clientlistsSchema);