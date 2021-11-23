import { combineReducers } from 'redux';
import userReducer from './userReducer';
import clientStatisticsReducer from './clientStatisticsReducer';
import clientListReducer from './clientListReducer';
import singleClientReducer from './singleClientReducer';
import clientToUseReducer from './clientToUseReducer';

const rootReducer = combineReducers({
	user: 				userReducer,
	clientStatistics:	clientStatisticsReducer,
	clientsList: 		clientListReducer,
	singleClient: 		singleClientReducer,
	clientToUse:		clientToUseReducer
});

export default rootReducer;