import { LOGIN, LOGOUT, SEND, RECEIVE } from './constants';

export const login = (context, name) => {
	context.setUser(name);
	return {
		type: LOGIN,
		payload: name
	};
};

export const logout = (context) => {
	context.setUser(undefined);
	return {
		type: LOGOUT
	};
};

export const send = (context, text) => {
	context.sendMessage(text);
	return {
		type: SEND,
		payload: text
	};
};

export const receive = (context, message) => {
	return {
		type: RECEIVE,
		payload: message
	};
};