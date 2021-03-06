import React, {useState, useRef, useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import { auth } from '../../firebase/Firebase';
import {Button, TextField, CircularProgress, Box, Grid, Card, Divider, CardHeader, Avatar, Typography, makeStyles} from "@material-ui/core"
import MoreVert from '@material-ui/icons/MoreVert'
import {useDetectOutsideClick} from "./useDetectOutsideClick";
import {List, ListItemButton, ListItemIcon, ListItemText} from '@mui/material'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Popover from '@mui/material/Popover'; 
import './Manage.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {editClientInfo} from "../../firebase/Firebase";
import FindClient from './FindClient';
import Alert from '@material-ui/lab/Alert';
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
	/*
	const dropdownRef=useRef(null);
	//const [isActive,setIsActive]=useDetectOutsideClick(dropdownRef,false);
	*/
	const[isActive,setIsActive]=useState(false);
	const onClick =() => setIsActive(!isActive);
	const clientStatisticsData = useSelector((state) => state.clientStatistics);
	const clientData = useSelector((state) => state.singleClient);
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	console.log(clientData);

	// when a name in list is clicked, get that client's data and store it in redux
	// useEffect(() => {
	// 	function storeData() {
	// storeSingleClient(dispatch(), props.id);
	// 	}

	// 	storeData();
	// }, [props.id]);

	let clientInfo = {};
	if (clientData && clientData.data && clientStatisticsData)
	{
		if (!loading && clientData.id!==props.id) setLoading(true);
		clientInfo.email = 'N/A';
		if (clientStatisticsData && clientStatisticsData.idObjects && clientStatisticsData.idObjects[props.id] && clientStatisticsData.idObjects[props.id].email) {
			clientInfo.email = clientStatisticsData.idObjects[props.id].email;
		}
		//clientInfo.email ??
		clientInfo.lastName = clientData.data.lastname || 'N/A';
		clientInfo.sex = clientData.data.sex || 'N/A';
		clientInfo.gender = clientData.data.gender || 'N/A';
		clientInfo.secondEmail = clientData.data.secondaryemail || 'N/A';
		clientInfo.phoneNumber = clientData.data.phonenumber || 'N/A';
		clientInfo.phoneType = clientData.data.phoneType || 'N/A';
		if (loading && clientData.id===props.id) setLoading(false);
	}
	
	const [open, setOpen] = useState(false);

	const [data,setData]=useState({uid:props.id,lastname:'',gender:'',sex:'',secondaryemail:'',phonenumber:'',phonetype:''})

	const [email,setEmail]=useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		//setIsActive(!isActive);
	};

	const handleChange = e => {
		const { name, value } = e.target;
		setData(prevState => ({
			...prevState,
			[name]: value
		}));

	};
		
	

	//calls the API to update the user info 
	const editUserInfo = async () => {
		try {
			//setIsActive(!isActive);
			let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if(!data.secondaryemail || re.test(data.secondaryemail)){
				setOpen(false);
				// save current uid
				data.uid = props.id;
				// edit in firebase
				console.log(data);
				const edit=await editClientInfo(data,auth);
				// edit in redux
				console.log(props.id);
				storeSingleClient(dispatch, props.id);
				console.log(edit);
				// reset data
				setData({uid:'',lastname:'',gender:'',sex:'',secondaryemail:'',phonenumber:'',phonetype:''});
			}
			else {
				setEmail(true);
			}
	

			
		} catch (e) {
			console.log(e);
		}
	};

	


	
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
							<div className={`menu ${isActive ? "active" : "inactive"}`}>
								<ul>
									<li>
										<Button variant="outlined" onClick={handleClickOpen}>
											Edit Client Information
										</Button>
										<Dialog open={open} onClose={handleClose}>
											<DialogTitle>Edit Client Information</DialogTitle>
											<DialogContent>
												<TextField
													autofocus
													margin="dense"
													id="name"
													label="Last Name"
													name='lastname'
													fullWidth
													variant="standard"
													value={data.lastname}
													onChange={handleChange}
													InputLabelProps={{ shrink: true }}
												/>
												<TextField
													name='gender'
													margin="dense"
													id="gender"
													label="Gender"
													fullWidth
													variant="standard"
													value={data.gender}
													onChange={handleChange}
													InputLabelProps={{ shrink: true }}
												/>
												<TextField
													name='sex'
													margin="dense"
													id="sex"
													label="Sex"
													fullWidth
													variant="standard"
													value={data.sex}
													onChange={handleChange}
													InputLabelProps={{ shrink: true }}
												/>
												<TextField
													name='secondaryemail'
													margin="dense"
													id="email"
													label="Secondary Email Address"
													type="email"
													fullWidth
													variant="standard"
													value={data.secondaryemail}
													onChange={handleChange}
													InputLabelProps={{ shrink: true }}
												/>
												<TextField
													name='phonenumber'
													margin="dense"
													id="number"
													label="Phone Number"
													fullWidth
													variant="standard"
													value={data.phonenumber}
													onChange={handleChange}
													InputLabelProps={{ shrink: true }}
												/>
												<TextField
													name='phonetype'
													margin="dense"
													id="type"
													label="Phone Type"
													fullWidth
													variant="standard"
													value={data.phonetype}
													onChange={handleChange}
													InputLabelProps={{ shrink: true }}
												/>
											
											</DialogContent>
											{email && <Alert severity="error">Please enter a valid email address</Alert>}
											<DialogActions>
												<Button onClick={handleClose}>Cancel</Button>
												<Button onClick={editUserInfo}>Submit</Button>
											</DialogActions>
										</Dialog>
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
				{!loading && <>
				<div>
					<p><strong>First Name: </strong>{(props.name).split(' ')[0]}</p>
					<p><strong>Last Name: </strong>{clientInfo.lastName}</p>
					<p><strong>Gender: </strong>{clientInfo.gender}</p>
					<p><strong>Sex: </strong>{clientInfo.sex}</p>
				</div>
				<div>	
					<p><strong>Email: </strong>{clientInfo.email}</p>
					<p><strong>Secondary Email: </strong>{clientInfo.secondEmail}</p>
					<p><strong>Phone number: </strong>{clientInfo.phoneNumber}</p>
					<p><strong>Phone Type: </strong>{clientInfo.phoneType}</p>
				</div>
				</>}
				{loading && <CircularProgress />}
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
	const dispatch = useDispatch();

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
		storeSingleClient(dispatch, id);
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