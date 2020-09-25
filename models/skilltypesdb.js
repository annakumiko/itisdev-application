const mongoose = require('mongoose');

var skilltypesSchema = new mongoose.Schema({
	skillID: String,
	skillName: String,
}, {collection: "skilltypes"});

module.exports = mongoose.model("skilltypes", skilltypesSchema);