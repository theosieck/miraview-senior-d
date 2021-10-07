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
TODO: formatting: boxes around names, left-aligned & vertically centered, spacing btwn names, column list on left with profile to right of it
TODO: onClick functionality for each patient name for client profile component
TODO: hide bullet points (css)
TODO: change input & button for adding a new patient to just button like design?
TODO: more checks on patient name input
*/
function PatientList() {
	
	function handlePatientListClick(listIndex) {
		// temporary
		document.title = listIndex.toString();
	}

	function handleAddPatientClick(name) {
		if (name === '') {
			//setInputValue('');
			return;
		}
		addPatient(patients => [...patients, name]);
		setInputName('');
	}

	const names = ['Nicholas Gattuso', 'Essence Peters', 'Derek Morris', 'Alex Conetta', 'Gene Donovan', 'Alex Stupar', 'Nicholas Gattuso'];
	
	// state hooks
	const [patients, addPatient] = useState(names);
	const [inputName, setInputName] = useState('');
	
	const listPatients = patients.map((name, index) => 
		<ul>
			<li key={index} onClick={() => handlePatientListClick(index)}>
				{name}
			</li>
		</ul>
	);

	return (
		<div>
			<b><p>{listPatients}</p></b>
			
			<input value={inputName} onChange={(e) => setInputName(e.target.value)} placeholder='Patient Name...' />
			<button onClick={() => handleAddPatientClick(inputName)}>
				+ New Patient
			</button>
		</div>
	);
}

export default Manage;