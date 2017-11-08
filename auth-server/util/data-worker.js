const fs = require("fs");

module.exports = function(databasePath) {

	let currentPath = databasePath;
	let instanceDB = JSON.parse(fs.readFileSync(currentPath, 'utf8'));
	instanceDB.save = function() {
		fs.writeFileSync(currentPath, JSON.stringify(this, null, 4));
	}

	return instanceDB;
}