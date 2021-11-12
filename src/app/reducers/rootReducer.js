import { combineReducers } from 'redux';
import userReducer from './userReducer';
import clientReducer from './clientReducer';
import clientListReducer from './clientListReducer';
import singleClientReducer from './singleClientReducer'

const rootReducer = combineReducers({
	user: 	userReducer,
	client:	clientReducer,
	clientsList: clientListReducer,
	singleClient: singleClientReducer
});

export default rootReducer;