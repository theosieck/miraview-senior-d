import React, {useState, useRef, useEffect} from 'react';
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
	const userData = useSelector((state) => state.user);
	const clientListData = useSelector((state) => state.clientsList);
	let info;
	if (clientListData && clientListData.clients) info = clientListData.clients;
	else info = {};

	// redirect to / if not logged in
	if (!userData.data) return <Redirect to='/'/>;

	return (
		<div>
			<hr />
			<ClientList data={info}/>
			{/* <FindClient /> */}
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
	const dropdownRef=useRef(null);
	const [isActive,setIsActive]=useDetectOutsideClick(dropdownRef,false);
	const onClick =() => setIsActive(!isActive);
	const clientData = useSelector((state) => state.singleClient);

	// when a name in list is clicked, get that client's data and store it in redux
	storeSingleClient(useDispatch(), props.id);

	let clientInfo = {};
	if (clientData && clientData.data)
	{
		//clientInfo.email ??
		clientInfo.lastName = clientData.data.lastname || 'N/A';
		clientInfo.sex = clientData.data.sex || 'N/A';
		clientInfo.gender = clientData.data.gender || 'N/A';
		clientInfo.secondEmail = clientData.data.secondaryemail || 'N/A';
		clientInfo.phoneNumber = clientData.data.phonenumber || 'N/A';
		clientInfo.phoneType = clientData.data.phoneType || 'N/A';
	}
	
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
					<p><strong>Gender: </strong>{clientInfo.gender}</p>
					<p><strong>Sex: </strong>{clientInfo.sex}</p>
				</div>
				<div>	
					<p><strong>Email: </strong>ngattusohw@gmail.com</p>
					<p><strong>Secondary Email: </strong>{clientInfo.secondEmail}</p>
					<p><strong>Phone number: </strong>{clientInfo.phoneNumber}</p>
					<p><strong>Phone Type: </strong>{clientInfo.phoneType}</p>
				</div>
			</div>
		</Card>
	);		
}

function ClientList(props) {
	const classes = useStyles();
	
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
			<FindClient handleClientListClick={handleClientListClick} />
		</div>
	);
}

export default Manage;