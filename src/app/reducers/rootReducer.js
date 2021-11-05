import { combineReducers } from 'redux';
// import userReducer from '../../slices/userSlice';
import userReducer from './userReducer';
// any other reducers go here!

const rootReducer = combineReducers({
	user:userReducer
});

export default rootReducer;