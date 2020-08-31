const mongoose = require('mongoose');

var clientsSchema = new mongoose.Schema({
	clientID: String,
	clientName: String,
	companyName: String,
	isActive: Boolean
}, {collection: "clients"});

modules.export = mongoose.model("clients", clientsSchema);