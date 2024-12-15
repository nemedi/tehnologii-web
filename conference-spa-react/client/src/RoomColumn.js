import React, {useState, useEffect} from 'react';
import SessionRow from './SessionRow';

function RoomColumn(properties) {
	const [sessions, setSessions] = useState([]);
	const style = {
		width: `${properties.width}%`,
	};
	const loadSessions = async (roomId) => {
		const response = await fetch(`/models/sessions?roomId=${roomId}`);
		if (response.status === 200) {
			setSessions(await response.json());
		}
	};
	useEffect(() => {loadSessions(properties.room.id);}, [properties.room.id]);
	return (
		<div className={`column background${properties.index % 4 + 1}`} style={style}>
			<p className="column-title">
				<a href={`#/rooms/${properties.room.id}`}>{properties.room.name}</a>
				<a href={`#/sessions/new?roomId=${properties.room.id}`} className="add">+</a>
			</p>
			<div className="cards">
				{
					sessions.map((session, index) => <SessionRow session={session} index={properties.index} key={index}/>)
				}
			</div>
		</div>
	);
}

export default RoomColumn;