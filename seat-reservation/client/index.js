window.onload = async () => {
	document.getElementById('container')
		.seatReservation({
			getSeats: async() => {
				const response = await fetch('/seats');
				return response.status === 200
					? await response.json() : [];
			},
			reserveSeat: async (row, column) =>
				(await fetch(`/seats?row=${row}&column=${column}`,
					{method: 'POST'})).status === 204,
			unreserveSeat: async (row, column) =>
				(await fetch(`/seats?row=${row}&column=${column}`,
					{method: 'DELETE'})).status === 204
		});
};