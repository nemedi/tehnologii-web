const {existsSync, readFileSync, writeFileSync} = require('fs');
const uuid = require('uuid');
module.exports = function(path) {
	function readStudents(path) {
		if (existsSync(path)) {
			return JSON.parse(readFileSync(path));
		} else {
			return {};
		}
	}
	function writeStudents(students, path) {
		writeFileSync(path, JSON.stringify(students));
	}
	const students = readStudents(path);
	return {
		getStudents() {
			return Object.entries(students)
				.map(([id, student]) => {
					student.id = id;
					return student;
				});
		},
		getStudent(id) {
			return students[id];		
		},
		addStudent(student) {
			const id = uuid.v4();
			students[id] = student;
			writeStudents(students, path);
			return id;
		},
		saveStudent(id, student) {
			if (students.hasOwnProperty(id)) {
				students[id] = student;
				writeStudents(students, path);
				return true;
			} else {
				return false;
			}
		},
		removeStudent(id) {
			if (students.hasOwnProperty(id)) {
				delete students[id];
				writeStudents(students, path);
				return true;
			} else {
				return false;
			}
		}
	};
};