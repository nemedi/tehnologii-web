window.onload = async () => {
	const response = await fetch('/seats');
	const seats = response.status === 200
		? await response.json() : [];
	document.getElementById('container')
		.seatReservation({
			seats,
			reserveSeat: async (row, column) =>
				(await fetch(`/seats?row=${row}&column=${column}`,
					{method: 'POST'})).status === 204,
			unreserveSeat: async (row, column) =>
				(await fetch(`/seats?row=${row}&column=${column}`,
					{method: 'DELETE'})) === 204
		});
};