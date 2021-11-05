import { combineReducers } from 'redux';
import userReducer from './userReducer';
import clientReducer from './clientReducer';

const rootReducer = combineReducers({
	user: 	userReducer,
	client:	clientReducer
});

export default rootReducer;