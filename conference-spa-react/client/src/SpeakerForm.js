import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from "react-router-dom";
import './confirmDialog';

function SpeakerForm(props) {
	const navigate = useNavigate();
	const {speakerId} = useParams();
	const [speaker, setSpeaker] = useState({
		firstName: '',
		lastName: '',
		affiliation: ''
	});
	const loadSpeaker = async (speakerId) => {
		if (speakerId && speakerId !== 'new') {
			const response = await fetch(`/models/speakers/${speakerId}`);
			if (response.status === 200) {
				setSpeaker(await response.json());
			}
		}
	}
	useEffect(() => {loadSpeaker(speakerId);} , [speakerId]);	
	async function saveSpeaker() {
		if (speakerId === 'new') {
			const response = await fetch(`/models/speakers`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(speaker)
			});
			if (response.status === 201) {
				navigate('/');
			}
		} else {
			const response = await fetch(`/models/speakers/${speakerId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(speaker)
			});
			if (response.status === 204) {
				navigate('/');
			}
		}
	}
	async function deleteSpeaker() {
		if (speakerId && speakerId !== 'new'
			&& await document.getElementById('dialog')
				.confirmDialog('Are you sure you want to remove this speaker?')) {
			const response = await fetch(`/models/speakers/${speakerId}`, {
				method: 'DELETE'
			});
			if (response.status === 204) {
				navigate('/');
			}
		}
	}
	function set(property, value) {
		const record = {...speaker};
		record[property] = value;
		setSpeaker(record);
	}
	return (
		<div className="form">
			<h1>Speaker</h1>
			<form onSubmit={saveSpeaker} onReset={() => navigate('/')}>
				<label>First Name</label>
				<input type="text" value={speaker.firstName}
					onChange={event => set('firstName', event.target.value)}/>
				<label>Last Name</label>
				<input type="text" value={speaker.lastName}
					onChange={event => set('lastName', event.target.value)}/>
				<label>Affiliation</label>
				<input type="text" value={speaker.affiliation}
					onChange={event => set('affiliation', event.target.value)}/>
				<div className="buttons">
					<input type="submit" className="save" value="Save"/>
					{speaker.id && speaker.id !== 'new' && <input type="button" className="delete"
						value="Delete" onClick={deleteSpeaker}/>}
					<input type="reset" value="Cancel"/>
				</div>
			</form>
			<div id="dialog" className="modal-dialog"/>
		</div>
	);
}

export default SpeakerForm;