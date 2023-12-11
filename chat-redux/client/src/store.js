import {legacy_createStore as createStore} from 'redux';
import chatReducer from './reducers';
export default createStore(chatReducer);