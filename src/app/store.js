import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import counterReducer from '../slices/counterSliceTEST';

// configure the redux store
export default configureStore({
	reducer: {
		user: userReducer,
		counter: counterReducer
	}
});