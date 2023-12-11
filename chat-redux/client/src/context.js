import React, {createContext} from 'react';
import {useDispatch} from 'react-redux';
import {ENDPOINT, JOIN, EXIT, CHAT} from './constants';
import {receive} from './actions'
const WebSocketContext = createContext(null);
export {WebSocketContext};
export default function({children}) {
	let user;
	let socket;
	const dispatch = useDispatch();
	if (!socket) {
		socket = new WebSocket(ENDPOINT);
		socket.binaryType = 'blob';
		socket.onmessage = event => {
			if (event.data instanceof Blob) {
				const reader = new FileReader();
				reader.onload = () => {
					dispatch(receive(JSON.parse(reader.result)));
				};
				reader.readAsText(event.data);
			} else {
				dispatch(receive(JSON.parse(event.data)));
			}
		};
	}
	function setUser(name) {
		const request = name
			? {type: JOIN, user: name}
			: {type: EXIT, user};
		socket.send(JSON.stringify(request));
		user = name;
	}
	function sendMessage(text) {
		const message = {type: CHAT, from: user, text};
		socket.send(JSON.stringify(message));
	}
	return (
		<WebSocketContext.Provider value={{setUser, sendMessage}}>
			{children}
		</WebSocketContext.Provider>
	);
};