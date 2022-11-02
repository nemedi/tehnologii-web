const uuid = require('uuid');
const {readRepositoryContent, writeRepositoryContent} = require('./repository');

function getStudents() {
	return Object.entries(readRepositoryContent())
		.map(([id, student]) => {
			student.id = id;
			return student;
		});
}

function getStudent(id) {
	return readRepositoryContent()[id];
}

function addStudent(student) {
	const students = readRepositoryContent();
	students[uuid.v4()] = student;
	writeRepositoryContent(students);
}

function removeStudent(id) {
	const students = readRepositoryContent();
	if (students.hasOwnProperty(id)) {
		delete students[id];
		writeRepositoryContent(students);
	}
}

module.exports = {getStudents, getStudent, addStudent, removeStudent};