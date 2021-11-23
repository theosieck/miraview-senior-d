const initialState = {
	id: null
}

const clientToUseReducer = (state=initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case 'SET_CLIENT':
			return {
				...state,
				id: payload
			};
		default:
			return state;
	}
}

export default clientToUseReducer;