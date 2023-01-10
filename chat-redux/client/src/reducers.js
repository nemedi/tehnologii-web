import { LOGIN, LOGOUT, SEND, RECEIVE } from './constants';

const initialState = {
	user: undefined,
	messages: []
};

export default function chatReducer(state, action) {
	if (!state) {
		return initialState;
	}
	switch (action.type) {
		case LOGIN:
			return {...state, user: action.payload};
		case LOGOUT:
			return {...state, user: undefined, messages: []};
		case SEND:
			return state;
		case RECEIVE:
			return {...state, messages: [...state.messages, action.payload]};
		default:
			return state;
	}
};