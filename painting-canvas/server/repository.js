const {readFileSync, writeFileSync} = require('fs');

module.exports = function(path) {
	function readRepositoryContent() {
		const content = readFileSync(path);
		return JSON.parse(content);
	}
	function writeRepositoryContent(content) {
		writeFileSync(path, JSON.stringify(content));
	}
	return {readRepositoryContent, writeRepositoryContent};;
};