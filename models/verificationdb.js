const mongoose = require('mongoose');

var verificationsSchema = new mongoose.Schema({
	verifyCode: String,
	userID: String
}, {collection: "verifications"});

modules.export = mongoose.model("verifications", verificationsSchema);