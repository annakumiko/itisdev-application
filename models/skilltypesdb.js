const mongoose = require('mongoose');

var skilltypesSchema = new mongoose.Schema({
	skillID: String,
	skillName: String
}, {collection: "skilltypes"});

modules.export = mongoose.model("skilltypes", skilltypesSchema);