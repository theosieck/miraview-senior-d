import React, {useState, useRef} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import {Box, Grid, Card, Divider, CardHeader, Avatar, Typography, makeStyles} from "@material-ui/core"
import MoreVert from '@material-ui/icons/MoreVert'
import {useDetectOutsideClick} from "./useDetectOutsideClick";
import {List, ListItemButton, ListItemIcon, ListItemText} from '@mui/material'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import './Manage.css';
import FindClient from './FindClient';
import { storeSingleClient } from '../../firebase/fetchData';

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
	
	// state hooks
	const [clients, addClient] = useState(props.data);
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
	
	function handleClientListClick(id, name) {
		setSelectedClient(id);
		showClientProfile(<Profile id={id} name={name} />);
	}

	return (
		<div>
			<Box>
				<Grid container spacing={0}>
					<Grid item xs={3}>
						<div>{listClients}</div>
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