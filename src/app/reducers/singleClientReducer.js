const initalState = {
	id: null,
    data: null
};

const singleClientReducer = (state = initalState, action) => {
	//console.log(action);
	const { type, payload } = action;

	switch (type) {
		case 'SET_SINGLE_CLIENT_DATA':
			console.log('payload', payload);
			return {
				id: payload.id,
                data: payload.data
			};
		case 'CLEAR_SINGLE_CLIENT_DATA':
			return {
				id: null,
				data: null
			};

		default:
			return state;
	}
};

export default singleClientReducer; 