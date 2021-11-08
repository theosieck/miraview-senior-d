import { combineReducers } from 'redux';
import userReducer from './userReducer';
import clientReducer from './clientReducer';
import clientListReducer from './clientListReducer';

const rootReducer = combineReducers({
	user: 	userReducer,
	client:	clientReducer,
	clientsList: clientListReducer
});

export default rootReducer;