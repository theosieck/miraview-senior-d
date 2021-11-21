const initalState = {
	loggedIn: false,
	id: null,
	data: null
};
  
const userReducer = (state = initalState, action) => {
	const { type, payload } = action;

	switch (type) {
		case 'LOG_IN':
			console.log('payload', payload);
			return {
				loggedIn: true,
				id: payload.id,
				data: payload.data
			};
		case 'LOG_OUT':
			return {
				loggedIn: false,
				id: null,
				data: null
			}
		case 'UPDATE_USER':
			return {
				...state,
				data: payload.data
			}

		default:
			return state;
	}
};

export default userReducer;