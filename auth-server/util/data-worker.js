const fs = require("fs");
const path = require('path');

module.exports = function(databasePath) {

	let currentPath = path.resolve(__dirname, "..", databasePath);
	let instanceDB = JSON.parse(fs.readFileSync(currentPath, 'utf8'));
	instanceDB.save = function() {
		fs.writeFileSync(currentPath, JSON.stringify(this, null, 4));
	}

	return instanceDB;
}