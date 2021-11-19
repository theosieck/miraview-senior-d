const initalState = {
	emails: null,
	groundingActivations: [null],
	symptomReports: [null]
};
  
const clientStatisticsReducer = (state = initalState, action) => {
	//console.log(action);
	const { type, payload } = action;

	switch (type) {
		case 'SET_CLIENT_STATISTICS_DATA':
			//console.log('payload', payload);
			return {
				emails: payload.emails,
				groundingActivations: payload.groundingActivations,
				symptomReports: payload.symptomReports
			};
		case 'CLEAR_CLIENT_STATISTICS_DATA':
			return {
				emails: null,
				groundingActivations: [null],
				symptomReports: [null]
			};

		default:
			return state;
	}
};

export default clientStatisticsReducer;