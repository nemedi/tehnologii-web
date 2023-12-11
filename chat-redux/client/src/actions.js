import {JOIN, EXIT, SEND, RECEIVE} from './constants';
export function join(context, user) {
	context.setUser(user);
	return {type: JOIN, user};
};
export function exit(context) {
	context.setUser(undefined);
	return {type: EXIT};
};
export function send(context, message) {
	context.sendMessage(message);
	return {type: SEND, message};
};
export function receive(message) {
	return {type: RECEIVE, message};
}