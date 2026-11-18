import {useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {getStudents, removeStudent} from '../api.js';

export default function StudentTable() {
	const [students, setStudents] = useState(null);
	const navigate = useNavigate();

	const load = useCallback(async () => setStudents(await getStudents()), []);
	useEffect(() => {
		load();
	}, [load]);

	async function handleRemove(id) {
		if (await removeStudent(id)) {
			load();
		}
	}

	if (students === null) {
		return <p>Se incarca...</p>;
	}
	return (
		<div className="row">
			<table>
				<thead>
					<tr>
						<th>Nume</th>
						<th>Prenume</th>
						<th>Data nasterii</th>
						<th>E-mail</th>
						<th>Telefon</th>
						<th>Specializare</th>
						<th>Grupa</th>
						<th>
							<input type="button" value="Adauga" onClick={() => navigate('/add')} />
						</th>
					</tr>
				</thead>
				<tbody>
					{students.map(s => (
						<tr key={s.id}>
							<td>{s.lastName}</td>
							<td>{s.firstName}</td>
							<td>{s.bornDate}</td>
							<td>{s.email}</td>
							<td>{s.phone}</td>
							<td>{s.section}</td>
							<td>{s.group}</td>
							<td>
								<input type="button" value="Sterge" onClick={() => handleRemove(s.id)} />
								<input type="button" value="Editeaza" onClick={() => navigate(`/edit/${s.id}`)} />
							</td>
						</tr>
					))}
				</tbody>
				{students.length === 0 && (
					<tfoot>
						<tr>
							<td colSpan="8">Nu exista nicio inregistrare, apasati butonul 'Adauga'.</td>
						</tr>
					</tfoot>
				)}
			</table>
		</div>
	);
}
