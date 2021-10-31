import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';

// configure the redux store
export default configureStore({
	reducer: {
		user: userReducer
	}
});