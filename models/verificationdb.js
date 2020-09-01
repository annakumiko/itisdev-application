const mongoose = require('mongoose');

var verificationsSchema = new mongoose.Schema({
	verifyCode: String,
	userID: String
}, {collection: "verifications"});

module.export = mongoose.model("verifications", verificationsSchema);