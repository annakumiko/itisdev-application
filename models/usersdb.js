const mongoose = require('mongoose');

var usersSchema = new mongoose.Schema({
	userID: String,
	userType: String,
	firstName: String,
	lastName: String,
	userEmail: String,
	password: String,
	// uStatus: String,
	deactivated: Boolean
}, {collection: "users"});

module.export = mongoose.model("users", usersSchema);