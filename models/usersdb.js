const mongoose = require('mongoose');

var usersSchema = new mongoose.Schema({
	userID: String,
	userType: String,
	firstName: String,
	lastName: String,
	email: String,
	password: String,
	uStatus: String,
	deactivated: Boolean
}, {collection: "users"});

module.exports = mongoose.model("users", usersSchema);