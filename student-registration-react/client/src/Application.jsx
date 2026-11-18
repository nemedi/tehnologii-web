import {Routes, Route, Navigate} from 'react-router-dom';
import StudentTable from './components/StudentTable.jsx';
import StudentForm from './components/StudentForm.jsx';

export default function Application() {
	return (
		<div className="container">
			<Routes>
				<Route path="/" element={<StudentTable />} />
				<Route path="/add" element={<StudentForm />} />
				<Route path="/edit/:id" element={<StudentForm />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</div>
	);
}
