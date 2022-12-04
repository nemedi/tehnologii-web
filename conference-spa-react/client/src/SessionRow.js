import React from 'react';

function SessionRow(props) {
	return (
		<div className={`card background${props.index % 4 + 1}`}>
			<p>
				<a href={`#/sessions/${props.session.id}`}>{props.session.title}</a>
			</p>
		</div>		
	);
}

export default SessionRow;