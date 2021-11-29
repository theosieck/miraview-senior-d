import { auth, getTherapistInfo, getClientsList, getClientStatistics, getSingleClient } from './Firebase';

const storeClientList = async (dispatch) => {
	let clients;
	try {
		clients = await getClientsList(null, auth);
		if (!clients || !clients.data || clients.data.code!==200) throw Error('Error fetching clients');
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
		if (!clientStatistics || !clientStatistics.data || clientStatistics.data.code!==200) throw Error('Error fetching client statistics');
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

const storeUser = async (dispatch) => {
	// pull user data from firebase
	let userData;
	try {
		userData = await getTherapistInfo(null, auth);
		if (!userData || !userData.data || userData.data.code!==200) throw Error('Error pulling therapist info');
	} catch (e) {
		console.log(e);
		alert(e.toString());
	}

	// update redux store
	dispatch({
		type: 'UPDATE_USER',
		payload: {
			data: userData.data.data
		}
	})
}


const storeSingleClient = async (dispatch, clientID) => {
	console.log('storeSingleClient')
	let singleClient;
	try {
		singleClient = await getSingleClient({id: clientID}, auth);
		if (!singleClient || !singleClient.data || singleClient.data.code!==200) throw Error('Error fetching single client.');
		singleClient = singleClient.data.data;
		console.log(singleClient);
	} catch (e) {
		console.log(e);
		alert(e.toString());
		// return;
	}

	dispatch({
		type: 'SET_SINGLE_CLIENT_DATA',
		payload: {
			id: clientID,
			data: singleClient
		}
	});
}

export {
	storeClientList,
	storeClientStatistics,
	storeUser,
	storeSingleClient
}