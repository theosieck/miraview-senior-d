// sign in -> use redux for context
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import { Button,TextField } from '@mui/material';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from "../firebase/Firebase";
import { useReducer, useState } from "react";
import { getClientsList, getClientStatistics, getTherapistInfo, getSingleClient  } from "../firebase/Firebase";
import Alert from '@material-ui/lab/Alert';

const getDummyData = () => {
	return {
		id: 'test',
		email: 'email@gmail.com',
		name: 'therapist name',
		patients: []
	}
}

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
		console.log('--Client Statistics Data Here--');
		// .data gives {code:..., data:...} so do .data.data
		clientStatisticsData = clientStatistics.data.data;
		//console.log(clientStatisticsData);
	} catch (e) {
		console.log(e);
		alert(e);
	}
	
	let clientEmails = [], clientGroundingActivations = [], clientSymptomReports = [];
	for (let key in clientStatisticsData) {
		clientEmails.push(clientStatisticsData[key].email);
		clientGroundingActivations.push(clientStatisticsData[key].groundingActivations);
		clientSymptomReports.push(clientStatisticsData[key].symptomReports);
	}

	// update redux store with client statistics data
	dispatch({
		type: 'SET_CLIENT_STATISTICS_DATA',
		payload: {
			emails: 				clientEmails,
			groundingActivations: 	clientGroundingActivations,
			symptomReports: 		clientSymptomReports
		}
	})
}

// TODO styling

export default function Login() {
	// userReducer
	const userData = useSelector((state) => state.user);
	console.log(userData);
	const dispatch = useDispatch();
	let error;
	// console.log(auth);

	//error message
	const [login,setLogin]=useState(false);

	// clientReducer
	const clientsData = useSelector((state) => state.clientStatistics);
	console.log(clientsData);

	// singleClientReducer
	const singleClientData = useSelector((state) => state.singleClient);
	console.log(singleClientData);

	// TESTING ONLY
	const createUser = async () => {
		let result;
		try {
			result = await createUserWithEmailAndPassword(auth, 'testing@test.test', '1234test');
			console.log ('user should be created');
			console.log(result);
		} catch (e) {
			console.log(e);
		}
	}

	// login function
	const logUserIn = async (e) => {
		// prevent default
		e.preventDefault();
		// reset error
		error = null;
		// get inputs
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;
		// console.log(email, password);

		// do some input checks before we send to firebase - TODO

		// send auth to firebase
		let result;
		try {
			result = await signInWithEmailAndPassword(auth, email, password);
			// console.log(auth);
			// console.log(result);
			// const res = await getClientsList(null, auth);
			// console.log(res);
		} catch (err) {
			error = err;
			console.log(err);
			setLogin(true);
			// handle error - TODO
			/** errors look like this
			 * {
					"error": {
						"code": 400,
						"message": "INVALID_EMAIL",
						"errors": [
						{
							"message": "INVALID_EMAIL",
							"domain": "global",
							"reason": "invalid"
						}
						]
					}
				}
			 */
		}

		// if successful, pull data from firebase - eddie your stuff goes here
		//console.log(error);
		if (!error) {
			const user = await getTherapistInfo(null,auth);
			console.log(user)
			var status=user.data.code;

			// gets from firebase and stores in redux the client statistics
			storeClientStatistics(dispatch);

			// gets clientList data from firebase and stores in redux
			storeClientList(dispatch);

			// if we did not get a user, call signOut() and don't log the user in
			// eddie you might have to change this conditional depending on what the return for not finding a user is
			if (status==500) {
				// sign out of firebase auth
				await signOut(auth);
			} else {
				console.log('tried to log in');
				// send dispatch to redux
				dispatch({
					type: 'LOG_IN',
					payload: {
						id: auth.currentUser.uid,
						data: user
					}
				});
			}
		}
	}
	// if user is logged in redirect to homepage
	if (userData && userData.loggedIn) return <Redirect to='/home'/>;

	

	return (
		<>
			<h1>Log In</h1>
			{/* <button onClick={createUser}>Create Test User</button> */}
			<form id='login-form' onSubmit={logUserIn}>
				<TextField id='email' label='Email' variant='outlined' />
				<TextField id='password' label='Password' variant='outlined' type='password' />
				<Button type='submit'>Login</Button>
			</form>
			{login && <Alert severity="error">Your login credentials could not be verified, please try again.</Alert>}
			<p>Test therapist 1 info: email: testing@test.test, password: 1234test</p>
			<p>Test therapist 2 info: email: test123@testing.test, password: test1234</p>
		</>
	)
	

}