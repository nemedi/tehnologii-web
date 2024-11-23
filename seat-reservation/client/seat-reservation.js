HTMLElement.prototype.seatReservation = async function (handlers) {
	const AVAILABLE = 1;
	const RESERVED = 2;
	const seats = await handlers.getSeats();
	const className = ['unavailable', 'available', 'reserved'];
	updateSeat = async (row, column, status) => {
		const cell = document.querySelector(`div[data-row="${row}"][data-column="${column}"]`);
		if (status === RESERVED) {
			if (await handlers.reserveSeat(row, column)) {
				cell.className = 'seat selected';
				seats[row][column] = status;
				return true;
			}
		} else if (status === AVAILABLE) {
			if (await handlers.unreserveSeat(row, column)) {
				cell.className = 'seat available';
				seats[row][column] = status;
				return true;
			}
		}
		return false;
	};
	handleClick = async (cell) => {
		const row = parseInt(cell.dataset.row);
		const column = parseInt(cell.dataset.column);
		const seat = seats[row][column];
		if (seat === AVAILABLE) {
			let done = true;
			if (sessionStorage.row && sessionStorage.column) {
				done = await updateSeat(parseInt(sessionStorage.row), parseInt(sessionStorage.column), AVAILABLE);
			}
			if (done && await updateSeat(row, column, RESERVED)) {
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
		+ seats.map((items, row) =>
				'<tr>'
					+ `<td class="seat">${row + 1}</td>`
						+ items.map((item, column) =>
								`<td>
									<div data-row="${row}"
										data-column="${column}"
										class="seat ${row === parseInt(sessionStorage.row)
											&& column === parseInt(sessionStorage.column)
											? 'selected' : className[item]}"
										onclick="handleClick(this)">
										${item !== 0 ? column + 1 : ''}
									</div>
								</td>`)
							.reduce((html, item) => html += item, '')
						+ `<td class="seat">${row + 1}</td>`
				+ '</tr>'
			)
			.reduce((html, item) => html += item, '')
		+ '</table>';
}