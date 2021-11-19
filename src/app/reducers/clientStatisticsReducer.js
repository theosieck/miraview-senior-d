const initalState = {
	idObjects: [null]
};
  
const clientStatisticsReducer = (state = initalState, action) => {
	//console.log(action);
	const { type, payload } = action;

	switch (type) {
		case 'SET_CLIENT_STATISTICS_DATA':
			//console.log('payload', payload);
			return {
				idObjects: payload.idObjects
			};
		case 'CLEAR_CLIENT_STATISTICS_DATA':
			return {
				idObjects: [null]
			};

		default:
			return state;
	}
};

export default clientStatisticsReducer;