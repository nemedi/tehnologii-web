import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from "react-router-dom";
import './confirmDialog';

function RoomForm() {
	const navigate = useNavigate();
	const {roomId} = useParams();
	const [room, setRoom] = useState({
		name: '',
		capacity: 0
	});
	const loadRoom = async (roomId) => {
		if (roomId && roomId !== 'new') {
			const response = await fetch(`/models/rooms/${roomId}`);
			if (response.status === 200) {
				setRoom(await response.json());
			}
		}
	}
	useEffect(() => {loadRoom(roomId);}, [roomId]);
	async function saveRoom() {
		if (roomId === 'new') {
			const response = await fetch('/models/rooms', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(room)
			});
			if (response.status === 201) {
				navigate('/');
			}
		} else {
			const response = await fetch(`/models/rooms/${roomId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(room)
			});
			if (response.status === 204) {
				navigate('/');
			}
		}
	}
	async function deleteRoom() {
		if (roomId && roomId !== 'new'
			&& await document.getElementById('dialog')
				.confirmDialog('Are you sure you want to remove this room?')) {
			const response = await fetch(`/models/rooms/${roomId}`, {
				method: 'DELETE'
			});
			if (response.status === 204) {
				navigate('/');
			}
		}
	}
	function set(property, value) {
		const record = {...room};
		record[property] = value;
		setRoom(record);
	}
	return (
		<div className="form">
			<h1>Room</h1>
			<form onSubmit={saveRoom} onReset={() => navigate('/')}>
				<label>Name</label>
				<input type="text" value={room.name}
					onChange={event => set('name', event.target.value)}/>
				<label>Capacity</label>
				<input type="number" value={room.capacity}
					onChange={event => set('capacity', event.target.value)}/>
				<div className="buttons">
					<input type="submit" value="Save"/>
					{roomId && roomId !== 'new' && <input type="button" className="delete"
						value="Delete" onClick={deleteRoom}/>}
					<input type="reset" value="Cancel"/>
				</div>
			</form>
			<div id="dialog" className="modal-dialog"/>
		</div>		
	);
}

export default RoomForm;