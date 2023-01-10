import { LOGIN, LOGOUT, SEND, RECEIVE } from './constants';

export function login(context, name) {
	context.setUser(name);
	return {
		type: LOGIN,
		payload: name
	};
};

export function logout(context) {
	context.setUser(undefined);
	return {
		type: LOGOUT
	};
};

export function send(context, text) {
	context.sendMessage(text);
	return {
		type: SEND,
		payload: text
	};
};

export function receive(context, text) {
	return {
		type: RECEIVE,
		payload: text
	};
}