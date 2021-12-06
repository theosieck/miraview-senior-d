import { useState } from "react";
import { findClient, updateTherapist, auth } from "../../firebase/Firebase";
import { Button, TextField, CircularProgress } from '@mui/material';
import { useSelector, useDispatch } from "react-redux";
import Alert from '@material-ui/lab/Alert';
import { storeClientStatistics } from "../../firebase/fetchData";

export default function FindClient (props) {
	const userData = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const clientListData = useSelector((state) => state.clientsList);
	const [clientFound, setClientFound] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const searchForClient = async (e) => {
		e.preventDefault();

		// set loading, error
		setLoading(true);
		setError(null);

		// get the email we're looking for
		let email = document.getElementById('client-email').value;

		// make sure exists, is string, etc
		try {
			if (!email) throw Error('Please enter an email.');
			if (typeof email!=='string') throw Error('Email must be a string.');
			email = email.trim();
			if (email==='') throw Error('Email must contain at least one character.');
		} catch (e) {
			setError(e.toString());
			return;
		}

		// look for the client
		let result;
		try {
			result = await findClient({email}, auth);
			if (!result || !result.data) throw Error('Something went wrong fetching the client.');
			if (result.data.code!==200) throw result.data;
		} catch (e) {
			if (e.message) setError(e.message);
			else setError('Error: Something went wrong finding the client.');
			setLoading(false);
			return;
		}
		const client = result.data.data;
		
		// null check
		if (!userData || !userData.data || !userData.data.clients) {
			setError('No user data found.');
			setLoading(false);
			return;
		}
		// make sure client isn't already a client of this therapist
		if (userData.data.clients.includes(client.uid)) {
			setError('This client is already in your client list.');
			setLoading(false);
			return;
		}
		setClientFound(client);

		// clear the input
		document.getElementById('client-email').value = '';

		// unset loading
		setLoading(false);
	}

	const addClient = async (e) => {
		e.preventDefault();

		console.log('adding client to therapist');
		
		// get the client id from clientFound
		const clientID = clientFound.uid;
		console.log(clientFound);
		setClientFound(false);
		setLoading(true);

		// update the therapist to add the new id
		let result;
		try {
			result = await updateTherapist({clients:[clientID]}, auth);
			if (!result || !result.data) throw Error('Error updating therapist.');
			if (result.data.code!==200) throw result.data;
		} catch (e) {
			if (e.message) setError(e.message);
			else setError('Error: Something went wrong finding the client.');
			setLoading(false);
			return;
		}

		// refetch client stats
		await storeClientStatistics(dispatch);

		// add client to redux store
		clientListData.clients[clientID] = clientFound.name;
		dispatch({
			type: 'SET_CLIENT_DATA',
			payload: clientListData
		});

		// focus on the new client
		props.handleClientListClick(clientID,clientFound.name);
		
		setLoading(false);
	}
	
	return (
		<div id="find-client">
			<form onSubmit={searchForClient} id="search-for-client">
				<label htmlFor="client-email" style={{display:"none"}}>Find Client</label>
				<TextField id="client-email" type="email" />
				<Button type="submit" variant="contained">Search</Button>
			</form>

			{loading && <CircularProgress id="find-client-loading" />}

			{error && <Alert severity="error">{error}</Alert>}

			{clientFound && <div id="client-found">
				<p>Found client <span id="client-found-name">{clientFound.name}</span></p>
				<Button onClick={addClient} variant="contained">Add</Button>
			</div>}
		</div>
	)
}