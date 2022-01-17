/* eslint-disable import/no-anonymous-default-export */
import { createContext } from 'react';
import { useDispatch } from 'react-redux';
import { ENDPOINT, LOGIN, LOGOUT, CHAT } from './constants';
import { receive } from './actions';

const WebSocketContext = createContext(null);
export {WebSocketContext};

export default ({ children }) => {
	let user;
	let socket;
	const dispatch = useDispatch();
	if (!socket) {
		socket = new WebSocket(ENDPOINT);
		socket.binaryType = 'blob';
		socket.onmessage = event => {
			if (event.data instanceof Blob) {
				const reader = new FileReader();
				reader.onload = () =>
					dispatch(receive(WebSocketContext, JSON.parse(reader.result)));
				reader.readAsText(event.data);
			} else {
				dispatch(receive(WebSocketContext,  JSON.parse(event.data)));
			}
		};
	}
	const setUser = name => {
		const message = name
			? { type: LOGIN, payload: name }
			: { type: LOGOUT, payload: user };
		user = name;
		socket.send(JSON.stringify(message));
	};
	const sendMessage = text => {
		const message = {
			type: CHAT,
			payload: { from: user, text }
		};
		socket.send(JSON.stringify(message));
	};
	return (
		<WebSocketContext.Provider value={{ setUser, sendMessage }}>
			{children}
		</WebSocketContext.Provider>
	);
};