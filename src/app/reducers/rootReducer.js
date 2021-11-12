import { combineReducers } from 'redux';
import userReducer from './userReducer';
import clientStatisticsReducer from './clientStatisticsReducer';
import clientListReducer from './clientListReducer';
import singleClientReducer from './singleClientReducer'

const rootReducer = combineReducers({
	user: 				userReducer,
	clientStatistics:	clientStatisticsReducer,
	clientsList: 		clientListReducer,
	singleClient: 		singleClientReducer
});

export default rootReducer;