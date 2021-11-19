import { useState } from "react";
import { findClient, updateTherapist, auth } from "../../firebase/Firebase";
import { Button, TextField } from '@mui/material';

export default function FindClient () {
	const [clientFound, setClientFound] = useState(null);

	const searchForClient = async (e) => {
		e.preventDefault();

		// get the email we're looking for
		let email = document.getElementById('client-email').value;
		email = email.trim();

		// TODO make sure client isn't already a client of this therapist

		// look for the client
		let result;
		try {
			result = await findClient({email}, auth);
			if (result.data.code!==200) throw 'Error: something went wrong fetching the client';
		} catch (e) {
			console.log(e);
			// TODO
		}

		const client = result.data.data;
		setClientFound(client);

		// clear the input
		document.getElementById('client-email').value = '';
	}

	const addClient = async (e) => {
		e.preventDefault();

		console.log('adding client to therapist');
		
		// get the client id from clientFound
		const clientID = clientFound.uid;

		// update the therapist to add the new id
		let result;
		try {
			result = await updateTherapist({clients:[clientID]}, auth);
			if (result.data.code!==200) throw 'Error: something went wrong updating the therapist';
		} catch (e) {
			console.log(e);
			//TODO
		}

		// add client to redux store - TODO
	}
	
	return (
		<>
			<form onSubmit={searchForClient} id="search-for-client">
				<label htmlFor="client-email" style={{display:"none"}}>Find Client</label>
				<TextField id="client-email" type="email" />
				<Button type="submit" variant="contained">Search</Button>
			</form>

			{clientFound && <div id="client-found">
				<p>Found client <span id="client-found-name">{clientFound.name}</span></p>
				<Button onClick={addClient} variant="contained">Add</Button>
			</div>}
		</>
	)
}