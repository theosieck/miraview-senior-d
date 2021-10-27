// sign in -> use redux for context

import { useSelector, useDispatch } from "react-redux";
import { login, logout } from '../slices/userSlice';

export default function Login() {
	const userData = useSelector((state) => state.user);
	const dispatch = useDispatch();

	return (
		<>
			<button onClick={() => dispatch(login({payload: {id:'testID', data:'test data'}}))}>Log in</button>
			<button onClick={() => dispatch(logout())}>Log out</button>

			{console.log(userData)}
		</>
	)
}


// this is just test stuff from the quickstart tutorial to try and figure out why mine isn't working
// i called it login so i wouldnt mess with the app code etc

// import { useSelector, useDispatch } from "react-redux";
// import { decrement, increment } from "../slices/counterSliceTEST";

// export default function Login() {
// 	const count = useSelector((state) => state.counter.value);
// 	const dispatch = useDispatch();

// 	return (
// 		<>
// 			<button onClick={() => dispatch(increment())}>Increment</button>
// 			{count}
// 			<button onClick={() => dispatch(decrement())}>Decrement</button>
// 		</>
// 	)
// }