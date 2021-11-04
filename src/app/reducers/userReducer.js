const initalState = {
	loggedIn: false,
	id: null,
	data: null
};
  
const userReducer = (state = initalState, action) => {
	console.log(action);
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

		default:
			return state;
	}
};

export default userReducer;