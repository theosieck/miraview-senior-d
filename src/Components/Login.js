// sign in -> use redux for context
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import { Button,TextField } from '@mui/material';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from "../firebase/Firebase";
// import { login} from '../slices/userSlice';
import { useReducer, useState } from "react";
import { getClientsList, getClientStatistics, getTherapistInfo } from "../firebase/Firebase";

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
		//console.log(clientStatistics);
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
			ids: 					clientStatisticsData.map(function(x) {return x.id}),
			groundingActivations: 	clientStatisticsData.map(function(x) {return x.groundingActivations}),
			symptomReports: 		clientStatisticsData.map(function(x) {return x.symptomReports})
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
	const [errorMessage,setErrorMessage]=useState('');

	// clientReducer
	const clientsData = useSelector((state) => state.client);
	console.log(clientsData);

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
			setErrorMessage("Incorrect Username or Password!");
			{errorMessage && <div>{errorMessage}</div>}
			alert(err);
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

			<p>Test user info: email: testing@test.test, password: 1234test</p>
		</>
	)
}