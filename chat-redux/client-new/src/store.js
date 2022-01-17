import { createStore } from 'redux';
import chatReducer from './reducers';

export default createStore(chatReducer);