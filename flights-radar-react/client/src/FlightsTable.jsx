export default function FlightsTable({flights}) {
	return (
		<table cellSpacing="0">
			<thead>
				<tr>
					<th className="num">No.</th>
					<th>Flight</th>
					<th>From</th>
					<th>To</th>
					<th>Airline</th>
					<th>Aircraft</th>
				</tr>
			</thead>
			<tbody>
				{flights.map((flight, index) => (
					<tr key={`${flight.number}-${index}`}>
						<td className="num">{index + 1}</td>
						<td>{flight.number}</td>
						<td>{flight.from}</td>
						<td>{flight.to}</td>
						<td>{flight.airline}</td>
						<td>{flight.aircraft}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
