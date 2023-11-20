const {readFileSync, writeFileSync} = require('fs');

const FILE = 'repository.json';

function readRepositoryContent() {
	const content = readFileSync(FILE);
	return JSON.parse(content);
}

function writeRepositoryContent(content) {
	writeFileSync(FILE, JSON.stringify(content));
}

module.exports = {readRepositoryContent, writeRepositoryContent};