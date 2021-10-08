import {useState} from 'react';
// possibly remove some of these imports
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

function Manage () {
	return (
		<div>
			<h1>Manage Page</h1>
			<PatientList />
		</div>
	);
}

// temporary code to visualize columns
const Item = styled(Paper)(({ theme }) => ({
	...theme.typography.body1,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
  }));
  

/*
TODO: formatting: boxes around names, left-aligned & vertically centered, spacing btwn names, hide bullet points (css)
TODO: change input & button for adding a new patient to just button like design?
TODO: hitting enter in input presses button
*/
function PatientList() {
	
	function handlePatientListClick(index) {
		showPatientProfile(patients[index] + ' profile here');
	}

	function handleAddPatientClick(name) {
		// remove all whitespaces from name
		const testName = name.replace(/\s+/g, '');
		
		// if name is empty or contains characters other than letters, don't include in list
		if (testName === '' || /[^a-zA-Z]/.test(testName)) {
			setInputName('');
			return;
		}

		addPatient(patients => [...patients, name]);
		setInputName('');
	}

	const names = ['Nicholas Gattuso', 'Essence Peters', 'Derek Morris', 'Alex Conetta', 'Gene Donovan', 'Alex Stupar', 'Nicholas Gattuso'];
	
	// state hooks
	const [patients, addPatient] = useState(names);
	const [inputName, setInputName] = useState('');
	const [patientFocused, showPatientProfile] = useState('');
	
	const listPatients = patients.map((name, index) => 
		<ul>
			<li key={index} onClick={() => handlePatientListClick(index)}>
				{name}
			</li>
		</ul>
	);

	return (
		<div>
			<Box>
				<Grid container spacing={1}>
					<Grid item xs={3}>
						<Item>Column 1</Item>
						<b><p>{listPatients}</p></b>
			
						<input value={inputName} onChange={(e) => setInputName(e.target.value)} placeholder='Patient Name...' />
						<button onClick={() => handleAddPatientClick(inputName)}>
							+ New Patient
						</button>
					</Grid>
					<Grid item xs={9}>
						<Item>Column 2</Item>
						<h2>{patientFocused}</h2>
					</Grid>
				</Grid>
			</Box>
		</div>
	);
}

export default Manage;