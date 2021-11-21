import { auth } from './Firebase';
import { getClientsList, getClientStatistics } from './Firebase';

const storeClientList = async (dispatch) => {
	let clients;
	try {
		clients = await getClientsList(null, auth);
		clients = clients.data.data;
	} catch (e) {
		console.log(e);
	}

	// update redux store with client data
	dispatch({
		type: 'SET_CLIENT_DATA',
		payload: {
			clients: clients		
		}
	});
}

const storeClientStatistics = async (dispatch) => {
	// pull client statistics data from firebase
	let clientStatisticsData;
	try {
		let clientStatistics = await getClientStatistics(null, auth);
		//console.log('--Client Statistics Data Here--');
		// .data gives {code:..., data:...} so do .data.data
		clientStatisticsData = clientStatistics.data.data;
		//console.log(clientStatisticsData);
	} catch (e) {
		console.log(e);
		alert(e);
	}
	
	// update redux store with client statistics data
	dispatch({
		type: 'SET_CLIENT_STATISTICS_DATA',
		payload: {
			idObjects: clientStatisticsData
		}
	})
}

export {
	storeClientList,
	storeClientStatistics
}