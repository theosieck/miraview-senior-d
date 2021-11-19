import React, {useState, useRef} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { auth } from "../../firebase/Firebase";
import { getSingleClient } from "../../firebase/Firebase";
import { Redirect } from 'react-router-dom';
import {Box, Grid, Button, TextField, Card, Divider, CardHeader, Avatar, Typography, makeStyles} from "@material-ui/core"
import MoreVert from '@material-ui/icons/MoreVert'
import {useDetectOutsideClick} from "./useDetectOutsideClick";
import {List, ListItemButton, ListItemIcon, ListItemText} from '@mui/material'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import './Manage.css';
import FindClient from './FindClient';

function Manage() {
	// redirect to / if not logged in
	const userData = useSelector((state) => state.user);

	const clientListData = useSelector((state) => state.clientsList);
	let info;
	if (clientListData && clientListData.clients) info = clientListData.clients;
	else info = {};

	if (!userData.loggedIn) return <Redirect to='/'/>;

	return (
		<div>
			<hr />
			<ClientList data={info}/>
			<FindClient />
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

const storeSingleClient = async (dispatch, clientID) => {
	let singleClient;
	try {
		singleClient = await getSingleClient({id: clientID}, auth);
		singleClient = singleClient.data.data;
		console.log(singleClient);
	} catch (e) {
		console.log(e);
	}

	dispatch({
		type: 'SET_SINGLE_CLIENT_DATA',
		payload: {
			id: clientID,
			data: singleClient
		}
	});
}

function Profile (props) {
	const clientID = props.id;
	const dropdownRef=useRef(null);
	const [isActive,setIsActive]=useDetectOutsideClick(dropdownRef,false);
	const onClick =() => setIsActive(!isActive);

	// when a name in list is clicked, get that client's data and store it in redux
	storeSingleClient(useDispatch(), clientID);
	
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

function ClientList(props) {
	const classes = useStyles();
	let clientList = props.data;
	//TODO - Switch names with actualinfo
	const names = ['Nicholas Gattuso', 'Essence Peters', 'Derek Morris', 'Alex Conetta', 'Gene Donovan', 'Alex Stupar', 'Nicholas Gattuso'];
	
	// state hooks
	const [clients, addClient] = useState(props.data);
	const [inputName, setInputName] = useState(null);
	const [clientFocused, showClientProfile] = useState(null);
	const [selectedIndex, setSelectedClient] = useState(null);

	const listClients = [];
	const clientIDs = Object.keys(clients);
	for (let index=0;index<clientIDs.length;index++) {
		const id = clientIDs[index];
		const name = clients[id];
		listClients.push(
			<List component='div' className={classes.list}>
				<ListItemButton selected={selectedIndex === index} onClick={() => handleClientListClick(id, name)}>
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
	}
	console.log(listClients);
	// const listClients = clients.map(({id, name}, index) => 
	// 	<List component='div' className={classes.list}>
	// 		<ListItemButton selected={selectedIndex === index} onClick={() => handleClientListClick(id, name)}>
	// 			<ListItemIcon>
	// 				<PersonOutlineIcon />
	// 			</ListItemIcon>
	// 			<ListItemText disableTypography primary={
	// 				<Typography variant='h5'>
	// 					{name}
	// 				</Typography>
	// 			}/>
	// 		</ListItemButton>
	// 	</List>
	// );
	
	function handleClientListClick(id, name) {
		setSelectedClient(id);
		showClientProfile(<Profile id={id} name={name} />);
	}

	function handleAddClientEnterPress(e, inputName) {
		if (e.key === 'Enter') {
			handleAddClientClick(inputName);
		}
	}

	function handleAddClientClick(name) {
		// remove all whitespaces from name
		const testName = name.replace(/\s+/g, '');
		
		// if name is empty or contains characters other than letters, don't include in list
		if (testName === '' || /[^a-zA-Z]/.test(testName)) {
			setInputName('');
			return;
		}

		addClient(clients => [...clients, {id: 0, name: name}]);
		setInputName('');
	}

	return (
		<div>
			<Box>
				<Grid container spacing={0}>
					<Grid item xs={3}>
						<div>{listClients}</div>
						{/* <TextField 	className='addNewPatient' value={inputName} onChange={(e) => setInputName(e.target.value)}
								onKeyDown={(e) => handleAddClientEnterPress(e, inputName)} placeholder='Client Name...' />
						<Button variant="contained" className='addNewPatient' onClick={() => handleAddClientClick(inputName)}>
							+ New Client
						</Button> */}
					</Grid>
					<Grid item xs={9}>
						<div>{clientFocused}</div>
					</Grid>
				</Grid>
			</Box>
		</div>
	);
}

export default Manage;