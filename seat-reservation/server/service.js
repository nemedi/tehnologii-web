const {readRepositoryContent, writeRepositoryContent} = require('./repository')('repository.json');

const UNAVAILABLE = 0;
const AVAILABLE = 1;
const RESERVED = 2;

function updateSeat(row, column, status, session) {
	const seats = readRepositoryContent();
	let done = false;
	if (row >= 0 && row < seats.length
		&& column >= 0 && column < seats[row].length
		&& seats[row][column] !== UNAVAILABLE) {
		if (status === RESERVED) {
			if (seats[row][column] === AVAILABLE) {
				done = true;
				session.row = row;
				session.column = column;
			}
		} else if (status === AVAILABLE) {
			if (row === session.row && column === session.column) {
				done = true;
				delete session.row;
				delete session.column;
			}
		}
	}
	if (done) {
		seats[row][column] = status;
		writeRepositoryContent(seats);
	}
	return done;
}

module.exports = {
	getSeats: () =>
		readRepositoryContent(),
	reserveSeat: (row, column, session) =>
		updateSeat(row, column, RESERVED, session),
	unreserveSeat: (row, column, session) =>
		updateSeat(row, column, AVAILABLE, session)
};