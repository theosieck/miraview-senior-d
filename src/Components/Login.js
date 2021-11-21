// sign in -> use redux for context
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import { Button,TextField } from '@mui/material';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from "../firebase/Firebase";
import { useState } from "react";
import { getTherapistInfo} from "../firebase/Firebase";
import Alert from '@material-ui/lab/Alert';
import { storeClientList, storeClientStatistics } from '../firebase/fetchData';

export default function Login() {
	const userData = useSelector((state) => state.user);
	const dispatch = useDispatch();
	let error;
	const [login,setLogin]=useState(false);	// login error

	// login function
	const logUserIn = async (e) => {
		// prevent default
		e.preventDefault();
		// reset error
		error = null;
		// get inputs
		let email = document.getElementById('email').value;
		const password = document.getElementById('password').value;

		// make sure email and password exist and are nonempty strings
		try {
			if (!email) throw Error('Please enter an email.');
			if (!password) throw Error('Please enter a password.');
			if (typeof email!=='string') throw Error('Email must be a string.');
			if (typeof password!=='string') throw Error('Password must be a string.');
			email = email.trim();
			if (email==='') throw Error('Email must contain at least one character.');
		} catch (e) {
			error = e.toString();
			return;
		}

		// send auth to firebase
		let result;
		try {
			result = await signInWithEmailAndPassword(auth, email, password);
			if (!result || !result.user) throw Error('Something went wrong logging in.');
		} catch (err) {
			error = err;
			console.log(err);
			setLogin(true);
		}

		// if successful, pull data from firebase
		if (!error) {
			const user = await getTherapistInfo(null,auth);
			var status=user.data.code;

			// gets from firebase and stores in redux the client statistics
			storeClientStatistics(dispatch);

			// gets clientList data from firebase and stores in redux
			storeClientList(dispatch);

			// if we did not get a user, call signOut() and don't log the user in
			if (status===500) {
				// sign out of firebase auth
				await signOut(auth);
			} else {
				// send dispatch to redux
				dispatch({
					type: 'LOG_IN',
					payload: {
						id: auth.currentUser.uid,
						data: user.data.data
					}
				});
			}
		}
	}

	// if user is logged in redirect to homepage
	if (userData.data) return <Redirect to='/home'/>;

	return (
		<>
			<h1>Log In</h1>
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