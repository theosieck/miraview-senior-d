import { useState } from "react";
import { findClient, updateTherapist, auth } from "../../firebase/Firebase";
import { Button, TextField, CircularProgress } from '@mui/material';
import { useSelector, useDispatch } from "react-redux";
import Alert from '@material-ui/lab/Alert';

export default function FindClient () {
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
		email = email.trim();

		// look for the client
		let result;
		try {
			result = await findClient({email}, auth);
			if (result.data.code!==200) throw result.data;
		} catch (e) {
			if (e.message) setError(e.message);
			else setError('Error: Something went wrong finding the client.');
			setLoading(false);
			return;
		}

		const client = result.data.data;
		// make sure client isn't already a client of this therapist
		if (userData.data.data.data.clients.includes(client.uid)) {
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
			if (result.data.code!==200) throw result.data;
		} catch (e) {
			if (e.message) setError(e.message);
			else setError('Error: Something went wrong finding the client.');
			setLoading(false);
			return;
		}

		// add client to redux store
		clientListData.clients[clientID] = clientFound.name;
		dispatch({
			type: 'SET_CLIENT_DATA',
			payload: clientListData
		});
		console.log(clientListData);

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