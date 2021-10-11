import React, {useState} from 'react';
import {useRef} from 'react';
import './Manage.css';
import { useDetectOutsideClick } from "./useDetectOutsideClick";
// possibly remove some of these imports
//import {styled} from '@mui/material/styles';
//import Box from '@mui/material/Box';
//import Paper from '@mui/material/Paper';
//import Grid from '@mui/material/Grid';

import Avatar from "@material-ui/core/Avatar"
import Card from "@material-ui/core/Card"
import { CardHeader } from '@material-ui/core';
import Divider from "@material-ui/core/Divider"
import Box from "@material-ui/core/Box"
import MoreVert from '@material-ui/icons/MoreVert'
import Grid from '@material-ui/core/Grid'
import {styled} from '@material-ui/core'
import Paper from '@material-ui/core/Paper'

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



function stringAvatar(name) {
	return {
		children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
	};
}

  
function Profile (props) {
	const dropdownRef=useRef(null);
	const [isActive,setIsActive]=useDetectOutsideClick(dropdownRef,false);
	const onClick =() => setIsActive(!isActive);

	
	//window.addEventListener("mousedown",handleClickOutside);
	//window.removeEventListener("mousedown",handleClickOutside);
	
	


	
	return (
		<Card>
			<CardHeader 
				avatar={
					<Avatar style={{ height: '90px', width: '90px' }} {...stringAvatar(props.name)} alt="Man" />
				}
				action={
					<div className="container">
						<div className="menu-container">
							<button onClick={onClick} className="menu-trigger">
								<MoreVert />
							</button>
							<nav ref={dropdownRef} 
								className={`menu ${isActive ? "active" : "inactive"}`}>
								<ul>
									<li>
										Edit
									</li>
									<li>
										Deactive
									</li>
								</ul>
							</nav>
						</div>
					</div>
					
				}
				titleTypographyProps={{variant:'h3' }}
				title={props.name}
			/>
			<Divider />
			<div class="profile-body">
				<div>
					<p><strong>First Name: </strong>{(props.name).split(' ')[0]}</p>
					<p><strong>Last Name: </strong>{(props.name).split(' ')[1]}</p>
					<p><strong>Gender: </strong>M</p>
					<p><strong>Sex: </strong>M</p>
				</div>
				<div>	
					<p><strong>Email: </strong>ngattusohw@gmail.com</p>
					<p><strong>Secondary Email: </strong>ngattuso205@gmail.com</p>
					<p><strong>Phone number: </strong>9089101254</p>
					<p><strong>Phone Type: </strong>Cell</p>
				</div>
			</div>

		</Card>
	);		

}
/*
TODO: formatting like design
TODO: change input & button for adding a new patient to just button like design?
TODO: keep <ul>,<li> or switch to material ui's list, listitem, listitemtext?
*/
function PatientList() {
	const names = ['Nicholas Gattuso', 'Essence Peters', 'Derek Morris', 'Alex Conetta', 'Gene Donovan', 'Alex Stupar', 'Nicholas Gattuso'];
	
	// state hooks
	const [patients, addPatient] = useState(names);
	const [inputName, setInputName] = useState('');
	const [patientFocused, showPatientProfile] = useState('');

	const listPatients = patients.map((name, index) => 
		<ul class='patientList'>
			<li key={index} onClick={() => handlePatientListClick(index)} class='patientListBorder'>
				{name}
			</li>
		</ul>
	);
	
	function handlePatientListClick(index) {
		showPatientProfile(<Profile name={patients[index]} />);
	}

	function handleAddPatientEnterPress(e, inputName) {
		if (e.key === 'Enter') {
			handleAddPatientClick(inputName);
		}
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

	return (
		<div>
			<Box>
				<Grid container spacing={0}>
					<Grid item xs={3}>
						<Item>Column 1</Item>
						<h3>{listPatients}</h3>
						<input 	value={inputName} onChange={(e) => setInputName(e.target.value)}
								onKeyDown={(e) => handleAddPatientEnterPress(e, inputName)} placeholder='Patient Name...' />
						<button onClick={() => handleAddPatientClick(inputName)}>
							+ New Patient
						</button>
					</Grid>
					<Grid item xs={9}>
						<div>{patientFocused}</div>
					</Grid>
				</Grid>
			</Box>
		</div>
	);
}

export default Manage;