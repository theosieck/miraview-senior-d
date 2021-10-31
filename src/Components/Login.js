// sign in -> use redux for context
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import { Button,TextField } from '@mui/material';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from "../firebase/Firebase";
import { login} from '../slices/userSlice';

const getDummyData = () => {
	return {
		id: 'test',
		email: 'email@gmail.com',
		name: 'therapist name',
		patients: []
	}
}

// TODO styling

export default function Login() {
	const userData = useSelector((state) => state.user);
	console.log(userData);
	const dispatch = useDispatch();
	// console.log(auth);

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

		// if we did not get a user, call signOut() and don't log the user in
		// eddie you might have to change this conditional depending on what the return for not finding a user is
		if (!user) {
			// sign out of firebase auth
			await signOut(auth);
		} else {
			// send dispatch to redux
			dispatch(login({
				id: user.id,
				data: user
			}));
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