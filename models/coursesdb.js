const mongoose = require('mongoose');

var coursesSchema = new mongoose.Schema({
	courseID: String,
	courseName : String,
	courseDesc: String,
	courseModules: String,
}, {collection: "courses"});

module.exports = mongoose.model("courses", coursesSchema);