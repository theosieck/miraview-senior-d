const initalState = {
	clients: [null],
};
  
const clientListReducer = (state = initalState, action) => {
	//console.log(action);
	const { type, payload } = action;

	switch (type) {
		case 'SET_CLIENT_DATA':
			console.log('payload', payload);
			return {
				clients: payload.clients
			};
		case 'CLEAR_CLIENT_DATA':
			return {
				clients: [null]
			};

		default:
			return state;
	}
};

export default clientListReducer;