const mongoose = require('mongoose');

var usersSchema = new mongoose.Schema({
	userID: String,
	userType: String,
	firstName: String,
	lastName: String,
	userEmail: String,
	password: String,
	deactivated: Boolean,
	isVerified: Boolean
}, {collection: "users"});

module.exports = mongoose.model("users", usersSchema);