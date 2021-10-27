// sign in -> use redux for context

import { useSelector, useDispatch } from "react-redux";
import { login, logout } from '../slices/userSlice';

export default function Login() {
	const userData = useSelector((state) => state.user);
	const dispatch = useDispatch();

	return (
		<>
			<button onClick={() => dispatch(login({id: 'test id',data:'test data'}))}>Log in</button>
			<button onClick={() => dispatch(logout())}>Log out</button>

			{console.log(userData)}
		</>
	)
}