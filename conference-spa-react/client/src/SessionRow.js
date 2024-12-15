import React from 'react';

function SessionRow(properties) {
	return (
		<div className={`card background${properties.index % 4 + 1}`}>
			<p>
				<a href={`#/sessions/${properties.session.id}`}>{properties.session.title}</a>
			</p>
		</div>		
	);
}

export default SessionRow;