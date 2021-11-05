/**
 * DON'T MAKE SLICES! THIS IS A TEMPLATE FOR HOW THE SLICES MAP TO THE REDUCERS IN ./REDUCERS
 */

import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
	name: 'user',
	initialState: {
		loggedIn: false,
		id: null,
		data: null
	},
	reducers: {
		// log the user in and set their id and user data
		login: (state, action) => {
			console.log(action);
			state.loggedIn = true;
			state.id = action.payload.id;
			state.data = action.payload.data;
		},
		logout: (state) => {
			state.loggedIn = false;
			state.id = null;
			state.data = null;
		}
	}
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;