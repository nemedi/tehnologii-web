HTMLElement.prototype.seatReservation = function(options) {
	const AVAILABLE = 1;
	const RESERVED = 2;
	const className = ['unavailable', 'available', 'reserved'];
	updateSeat = async (row, column, status) => {
		const cell = document.querySelector(`div[data-row="${row}"][data-column="${column}"]`);
		if (status === RESERVED) {
			if (await options.reserveSeat(row, column)) {
				cell.className = 'seat selected';
				options.seats[row][column] = status;
				return true;
			}
		} else if (status === AVAILABLE) {
			if (await options.unreserveSeat(row, column)) {
				cell.className = 'seat available';
				options.seats[row][column] = status;
				return true;
			}
		}
		return false;
	};
	handleClick = async (cell) => {
		const row = parseInt(cell.dataset.row);
		const column = parseInt(cell.dataset.column);
		const seat = options.seats[row][column];
		if (seat === AVAILABLE) {
			let ok = true;
			if (sessionStorage.row && sessionStorage.column) {
				ok = await updateSeat(parseInt(sessionStorage.row), parseInt(sessionStorage.column), AVAILABLE);
			}
			if (ok && await updateSeat(row, column, RESERVED)) {
				sessionStorage.row = row;
				sessionStorage.column = column;
			}
		} else if (seat === RESERVED) {
			if (await updateSeat(row, column, AVAILABLE)) {
				delete sessionStorage.row;
				delete sessionStorage.column;
			}
		}
	};
	this.innerHTML = '<table cellspacing="0" cellpadding="0" class="screen">'
		+ options.seats.map((seats, row) =>
				'<tr>'
					+ `<td class="seat">${row + 1}</td>`
						+ seats.map((seat, column) =>
								`<td>
									<div data-row="${row}"
										data-column="${column}"
										class="seat ${row === parseInt(sessionStorage.row)
											&& column === parseInt(sessionStorage.column)
											? 'selected' : className[seat]}"
										onclick="handleClick(this)">
										${seat !== 0 ? column + 1 : ''}
									</div>
								</td>`)
							.reduce((html, item) => html += item, '')
						+ `<td class="seat">${row + 1}</td>`
				+ '</tr>'
			)
			.reduce((html, item) => html += item, '')
		+ '</table>';
}