import {JOIN, EXIT, SEND, RECEIVE} from './constants';
const initialState = {user: undefined, messages: []};
export default function chatReducer(state, action) {
	if (!state) {
		return initialState;
	}
	switch (action.type) {
		case JOIN:
			return {...state, user: action.user};
		case EXIT:
			return {...state, user: undefined, messages: []};
		case SEND:
			return state;
		case RECEIVE:
			return {...state, messages: [action.message, ...state.messages]};
		default:
			return state;
	}
};