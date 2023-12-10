import React, {useState, useEffect} from 'react';
import SessionRow from './SessionRow';

function RoomColumn(props) {
	const [sessions, setSessions] = useState([]);
	const style = {
		width: `${props.width}%`,
	};
	const loadSessions = async (roomId) => {
		const response = await fetch(`/models/sessions?roomId=${roomId}`);
		if (response.status === 200) {
			setSessions(await response.json());
		}
	};
	useEffect(() => {loadSessions(props.room.id);}, [props.room.id]);
	return (
		<div className={`column background${props.index % 4 + 1}`} style={style}>
			<p className="column-title">
				<a href={`#/rooms/${props.room.id}`}>{props.room.name}</a>
				<a href={`#/sessions/new?roomId=${props.room.id}`} className="add">+</a>
			</p>
			<div className="cards">
				{
					sessions.map((session, index) => <SessionRow session={session} index={props.index} key={index}/>)
				}
			</div>
		</div>
	);
}

export default RoomColumn;