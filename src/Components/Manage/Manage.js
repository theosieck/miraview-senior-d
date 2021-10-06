import {useState} from 'react';

function Manage () {
	return (
		<div>
			<h1>Manage Page</h1>
			<PatientList />
		</div>
	);
}

/*
TODO: formatting: boxes around names, left-aligned & vertically centered, spacing btwn names
TODO: onClick functionality for each patient name for client profile component
TODO: new patient button functionality with patient name input
TODO: hide bullet points (use <li> or something else?)
*/
function PatientList() {
	const names = ['Nicholas Gattuso', 'Essence Peters', 'Derek Morris', 'Alex Conetta', 'Gene Donovan', 'Alex Stupar', 'Nicholas Gattuso'];
	const [patients, addPatient] = useState(names);
	const listPatients = patients.map((name) => <li>{name}</li>)

	return (
		<div>
			<b><p>{listPatients}</p></b>
			<button onClick={() => addPatient(patients => [...patients, 'name'])}>
				+ New Patient
			</button>
		</div>
	);
}

export default Manage;