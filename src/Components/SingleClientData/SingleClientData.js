import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

export default function SingleClientData() {
	const userData = useSelector((state) => state.user);
	const clientToUse = useSelector((state) => state.clientToUse);
	// redirect to / if not logged in
	if (!userData.data) return <Redirect to='/'/>;

	return <h1>Data for {clientToUse.id}</h1>;
}