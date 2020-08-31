const mongoose = require('mongoose');

var modulesSchema = new mongoose.Schema({
	moduleID: String,
	courseID: String,
	moduleTitle: String,
	moduleType: String
}, {collection: "modules"});

modules.export = mongoose.model("modules", modulesSchema);