import React, {useState, useEffect} from 'react';
import {useParams, useNavigate, useLocation} from "react-router-dom";
import './confirmDialog';

function SessionForm(props) {
	const navigate = useNavigate();
	const {sessionId} = useParams();
	const {search} = useLocation();
	const queryParameters = new URLSearchParams(search);
	const roomId = queryParameters.get('roomId');
	const [session, setSession] = useState({
		title: '',
		description: '',
		speakerId: 'new',
		roomId: roomId ? roomId : 'new',
		begin: '',
		end: ''
	});
	const [speakers, setSpeakers] = useState([]);
	const [rooms, setRooms] = useState([]);
	const loadSession = async (sessionId) => {
		if (sessionId && sessionId !== 'new') {
			const response = await fetch(`/models/sessions/${sessionId}`);
			if (response.status === 200) {
				setSession(await response.json());
			}
		}
	}
	const loadSpeakers = async () => {
		const response = await fetch(`/models/speakers`);
		if (response.status === 200) {
			setSpeakers(await response.json());
		}
	};
	const loadRooms = async () => {
		const response = await fetch(`/models/rooms`);
		if (response.status === 200) {
			setRooms(await response.json());
		}
	};
	useEffect(() => {loadSpeakers();}, [speakers]);
	useEffect(() => {loadRooms();}, [rooms]);
	useEffect(() => {loadSession(sessionId);}, [sessionId]);
	function set(property, value) {
		const record = {...session};
		record[property] = value;
		setSession(record);
	}
	async function saveSession() {
		if (sessionId === 'new') {
			const response = await fetch(`/models/sessions`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(session)
			});
			if (response.status === 201) {
				navigate('/');
			}
		} else {
			const response = await fetch(`/models/sessions/${sessionId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(session)
			});
			if (response.status === 204) {
				navigate('/');
			}
		}
	}
	async function deleteSession() {
		if (session.id && sessionId !== 'new'
			&& await document.getElementById('dialog')
				.confirmDialog('Are you sure you want to remove this session?')) {
			const response = await fetch(`/models/sessions/${sessionId}`, {
				method: 'DELETE'
			});
			if (response.status === 204) {
				navigate('/');
			}
		}
	}
	return (
		<div className="form">
			<h1>Session</h1>
			<form onSubmit={saveSession} onReset={() => navigate('/')}>
				<label>Title</label>
				<input type="text" value={session.title}
					onChange={event => set('title', event.target.value)}/>
				<label>Description</label>
				<textarea rows="10" value={session.description}
					onChange={event => set('description', event.target.value)}/>
				<label>Speaker</label>
				<div className="select">
					<select value={session.speakerId}
						onChange={event => set('speakerId', event.target.value)}>
						<option value="new">-- New --</option>
						{
							speakers.map((speaker, index) =>
								(<option key={index} value={speaker.id}>{speaker.firstName} {speaker.lastName}</option>))
						}
					</select>
					<input type="button" className="edit" value="Edit"
						onClick={() => navigate(`/speakers/${session.speakerId}`)}/>
				</div>
				<label>Room</label>
				<div className="select">
					<select value={session.roomId}
						onChange={event => set('roomId', event.target.value)}>
						<option value="new">-- New --</option>
						{
							rooms.map((room, index) =>
								(<option key={index} value={room.id}>{room.name}</option>))
						}
					</select>		
					<input type="button" className="edit" value="Edit"
						onClick={() => navigate(`/rooms/${session.roomId}`)}/>
				</div>
				<label>Begin</label>
				<input type="time" value={session.begin}
					onChange={event => set('begin', event.target.value)}/>
				<label>End</label>
				<input type="time" value={session.end}
					onChange={event => set('end', event.target.value)}/>
				<div className="buttons">
					<input type="submit" value="Save"/>
					{sessionId && sessionId !== 'new' && <input type="button" className="delete"
						value="Delete" onClick={deleteSession}/>}
					<input type="reset" value="Cancel"/>
				</div>
			</form>
			<div id="dialog" className="modal-dialog"/>
		</div>
	);
}

export default SessionForm;