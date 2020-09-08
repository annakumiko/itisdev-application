const mongoose = require('mongoose');

var modulesSchema = new mongoose.Schema({
	moduleID: String,
	courseID: String,
	moduleTitle: String,
	moduleType: String
}, {collection: "modules"});

module.exports = mongoose.model("modules", modulesSchema);