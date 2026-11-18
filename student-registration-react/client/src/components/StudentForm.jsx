import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {addStudent, getStudent, removeStudent, saveStudent} from '../api.js';

const EMPTY = {
	lastName: '',
	firstName: '',
	bornDate: '',
	email: '',
	phone: '',
	section: 'IE',
	group: ''
};

const FIELDS = [
	['lastName', 'Nume', 'text', true],
	['firstName', 'Prenume', 'text', true],
	['bornDate', 'Data nasterii', 'date', false],
	['email', 'E-mail', 'email', true],
	['phone', 'Telefon', 'tel', false]
];

export default function StudentForm() {
	const {id} = useParams();
	const existing = id !== undefined;
	const navigate = useNavigate();
	const [student, setStudent] = useState(EMPTY);
	const [loading, setLoading] = useState(existing);

	useEffect(() => {
		if (!existing) {
			return;
		}
		let cancelled = false;
		getStudent(id).then(found => {
			if (cancelled) {
				return;
			}
			if (found) {
				const {id: _ignored, ...rest} = found;
				setStudent({...EMPTY, ...rest});
				setLoading(false);
			} else {
				navigate('/', {replace: true});
			}
		});
		return () => {
			cancelled = true;
		};
	}, [id, existing, navigate]);

	const change = event =>
		setStudent(s => ({...s, [event.target.name]: event.target.value}));

	async function submit(event) {
		event.preventDefault();
		const ok = existing ? await saveStudent(id, student) : await addStudent(student);
		if (ok) {
			navigate('/');
		}
	}

	async function remove() {
		if (await removeStudent(id)) {
			navigate('/');
		}
	}

	if (loading) {
		return <p>Se incarca...</p>;
	}
	return (
		<form onSubmit={submit}>
			{FIELDS.map(([name, label, type, required]) => (
				<div className="row" key={name}>
					<div className="col-20">
						<label htmlFor={name}>{label}</label>
					</div>
					<div className="col-80">
						<input id={name} name={name} type={type} value={student[name]}
							onChange={change} required={required} />
					</div>
				</div>
			))}
			<div className="row">
				<div className="col-20">
					<label htmlFor="section">Specializarea</label>
				</div>
				<div className="col-80">
					<select id="section" name="section" value={student.section}
						onChange={change} required>
						<option value="IE">Informatica</option>
						<option value="CE">Cibernetica</option>
						<option value="SE">Statistica</option>
					</select>
				</div>
			</div>
			<div className="row">
				<div className="col-20">
					<label htmlFor="group">Grupa</label>
				</div>
				<div className="col-80">
					<input id="group" name="group" type="number" value={student.group}
						onChange={change} required />
				</div>
			</div>
			<br />
			<div className="row">
				<input type="button" value="Renunta" onClick={() => navigate('/')} />
				{existing && <input type="button" value="Sterge" onClick={remove} />}
				<input type="submit" value="Salveaza" />
			</div>
		</form>
	);
}
