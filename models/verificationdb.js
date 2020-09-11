const mongoose = require('mongoose');

var verificationsSchema = new mongoose.Schema({
	verifyCode: String,
	email: String
}, {collection: "verifications"});

module.exports = mongoose.model("verifications", verificationsSchema);