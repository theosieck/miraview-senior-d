// sign in -> use redux for context
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import { Button,TextField } from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../firebase/Firebase";
import { login, logout } from '../slices/userSlice';

const getDummyData = () => {
	return {
		id: 'test',
		email: 'email@gmail.com',
		name: 'therapist name',
		patients: []
	}
}

// TODO styling
/**
 * QUESTIONS
 * can we make test users?
 * should anyone in the firebase users tab be able to log in or do we need to add some sort of logic so that it's only therapists?
 */

export default function Login() {
	const userData = useSelector((state) => state.user);
	const dispatch = useDispatch();

	// login function
	const logUserIn = async (e) => {
		// prevent default
		e.preventDefault();

		// get inputs
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;
		console.log(email, password);

		// do some input checks before we send to firebase - TODO

		// send auth to firebase
		let result;
		try {
			result = await signInWithEmailAndPassword(auth, email, password);
			console.log(result);
		} catch (err) {
			console.log(err);
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
		const user = getDummyData();

		// send dispatch to redux
		dispatch(login({
			id: user.id,
			data: user
		}));
	}

	// TODO where should log out functionality be? in navbar?
	// dispatch(logout())

	// if user is logged in redirect to homepage
	if (userData.loggedIn) return <Redirect to='/home'/>;

	return (
		<>
			<h1>Log In</h1>
			<form id='login-form' onSubmit={logUserIn}>
				<TextField id='email' label='Email' variant='outlined' />
				<TextField id='password' label='Password' variant='outlined' type='password' />
				<Button type='submit'>Login</Button>
			</form>
		</>
	)
}