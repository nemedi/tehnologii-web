export async function getCoordinates(city) {
	const response = await fetch(`/coordinates/${encodeURIComponent(city)}`);
	if (response.status === 200) {
		return await response.json();
	}
	return null;
}

export async function getFlights(latitude, longitude) {
	const response = await fetch(
		`/flights?latitude=${latitude}&longitude=${longitude}`);
	if (response.status === 200) {
		return await response.json();
	}
	return [];
}
