const {readRepositoryContent, writeRepositoryContent} = require('./repository');

const UNAVAILABLE = 0;
const AVAILABLE = 1;
const RESERVED = 2;

function getSeats() {
	return readRepositoryContent();
}

function updateSeat(row, column, status, session) {
	const seats = readRepositoryContent();
	let ok = false;
	if (row >= 0 && row < seats.length
		&& column >= 0 && column < seats[row].length
		&& seats[row][column] !== UNAVAILABLE) {
		if (status === RESERVED) {
			if (seats[row][column] === AVAILABLE) {
				ok = true;
				session.row = row;
				session.column = column;
			}
		} else if (status === AVAILABLE) {
			if (row === session.row && column === session.column) {
				ok = true;
				delete session.row;
				delete session.column;
			}
		}
	}
	if (ok) {
		seats[row][column] = status;
		writeRepositoryContent(seats);
	}
	return ok;
}

function reserveSeat(row, column, session) {
	return updateSeat(row, column, RESERVED, session);
}

function unreserveSeat(row, column, session) {
	return updateSeat(row, column, AVAILABLE, session);
}

module.exports = {getSeats, reserveSeat, unreserveSeat};