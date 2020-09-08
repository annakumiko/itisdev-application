const mongoose = require('mongoose');

var clientsSchema = new mongoose.Schema({
	clientID: String,
	clientName: String,
	companyName: String,
	email: String,
	contactNo: String,
	isActive: Boolean
}, {collection: "clients"});

module.exports = mongoose.model("clients", clientsSchema);