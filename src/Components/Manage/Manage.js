import React, {useState, useRef} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import {Box, Grid, Button, TextField, Card, Divider, CardHeader, Avatar, Typography, makeStyles} from "@material-ui/core"
import MoreVert from '@material-ui/icons/MoreVert'
import {useDetectOutsideClick} from "./useDetectOutsideClick";
import {List, ListItemButton, ListItemIcon, ListItemText} from '@mui/material'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import './Manage.css';

function Manage() {
	// redirect to / if not logged in
	const userData = useSelector((state) => state.user);
	console.log(userData);
	if (!userData.loggedIn) return <Redirect to='/'/>;

	return (
		<div>
			<hr />
			<PatientList />
		</div>
	);
}

const useStyles = makeStyles({
	list: {
		border: '1px solid black',
		'&:hover': {
            backgroundColor: '#DBF3FA',
        },
	}
});

function stringAvatar(name) {
	if (name.indexOf(' ') === -1) {
		return {
			children: `${name}`
		};
	}
	return {
		children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
	};
}

function Profile (props) {
	const dropdownRef=useRef(null);
	const [isActive,setIsActive]=useDetectOutsideClick(dropdownRef,false);
	const onClick =() => setIsActive(!isActive);
	
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
							<div ref={dropdownRef} 
								className={`menu ${isActive ? "active" : "inactive"}`}>
								<ul>
									<li>
										Edit
									</li>
									<li>
										Deactive
									</li>
								</ul>
							</div>
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

function PatientList() {
	const classes = useStyles();
	//TODO - Switch names with actual patient info
	const names = ['Nicholas Gattuso', 'Essence Peters', 'Derek Morris', 'Alex Conetta', 'Gene Donovan', 'Alex Stupar', 'Nicholas Gattuso'];
	
	// state hooks
	const [patients, addPatient] = useState(names);
	const [inputName, setInputName] = useState(null);
	const [patientFocused, showPatientProfile] = useState(null);
	const [selectedIndex, setSelectedIndex] = useState(null);

	const listPatients = patients.map((name, index) => 
		<List component='div' className={classes.list}>
			<ListItemButton selected={selectedIndex === index} onClick={() => handlePatientListClick(index)}>
				<ListItemIcon>
					<PersonOutlineIcon />
				</ListItemIcon>
				<ListItemText disableTypography primary={
					<Typography variant='h5'>
						{name}
					</Typography>
				}/>
			</ListItemButton>
		</List>
	);
	
	function handlePatientListClick(index) {
		setSelectedIndex(index);
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
						<div>{listPatients}</div>
						<TextField 	className='addNewPatient' value={inputName} onChange={(e) => setInputName(e.target.value)}
								onKeyDown={(e) => handleAddPatientEnterPress(e, inputName)} placeholder='Patient Name...' />
						<Button variant="contained" className='addNewPatient' onClick={() => handleAddPatientClick(inputName)}>
							+ New Patient
						</Button>
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