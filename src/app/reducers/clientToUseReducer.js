const initialState = {
	id: null,
	name: null,
	email: null
}

const clientToUseReducer = (state=initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case 'SET_CLIENT':
			return {
				...state,
				id: payload.id,
				name: payload.name,
				email: payload.email
			};
		default:
			return state;
	}
}

export default clientToUseReducer;