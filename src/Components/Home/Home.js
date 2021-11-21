import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Paper, Avatar } from '@material-ui/core';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PeopleIcon from '@mui/icons-material/People';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Button from '@mui/material/Button';
import ArrowRightAlt from '@mui/icons-material/ArrowRightAlt';
import {auth} from '../../firebase/Firebase';
import { storeClientList, storeClientStatistics } from '../../firebase/fetchData';

function Home () {
	// pull data from redux store
	const userData = useSelector((state) => state.user);
	const clientsStatisticsData = useSelector((state) => state.clientStatistics);
	const clientListData = useSelector((state) => state.clientsList);
	let clients;
	if (clientListData && clientListData.clients) ({clients} = clientListData);
	else clients = {};
	let activeClientsInfo = userData.data.data.data.clients.length;
	
	const dispatch = useDispatch();
	// refetch data from firebase and store in redux
	storeClientList(dispatch);
	storeClientStatistics(dispatch);

	// redirect to / if not logged in
	if (!userData.data || !auth.currentUser) return <Redirect to='/'/>;

	return(
		<div>
			<ClientOverview activeClients={activeClientsInfo}/>
			<ClientGrid clientList={clients} clientStats={clientsStatisticsData}></ClientGrid>
		</div>
	);	   
}

function ClientOverview(props)
{
	let activeClients = props.activeClients
	return (
		<div style={{ width: '70%', borderBottom: '1px solid gray', marginBottom: "10px"}}>
			<Box>
				<Grid container spacing={0}>
					<Grid item xs={6} sm={3}>
						<h4 style={{margin:'10px', padding:'10px', marginRight:'20px', textAlign:"center", borderRight: "1px solid gray"}}>My Clients
						</h4>
					</Grid>
					<Grid item xs={6} sm={3}>
						<PlayArrowIcon fontSize="small"></PlayArrowIcon>3 Active Today
					</Grid>
					<Grid item xs={6} sm={3}>
						<PeopleIcon fontSize="small"></PeopleIcon>{activeClients} Active Clients
					</Grid>
				</Grid>
			</Box>
		</div>
	);
}

function ClientRow(props)
{
	const info = {
		clientName: props.name,
		id: props.id,
		groundingActivations: props.groundingActivations || 0,
		symptomReports: props.symptomReports || 0
	};

	return (
		<Grid container>
			<Grid item xs={3}>
				<Grid container spacing={0}>
					<Grid item xs={3}>
						<Avatar/>
					</Grid>
					<Grid item xs={9}>
						<h3 className="name">{info.clientName}</h3>
						<h4 className="age">Age: 42</h4>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={3}>
				<Grid container spacing={0}>
					<Grid item xs={2}>
						<TrendingDownIcon fontSize="large"></TrendingDownIcon>
					</Grid>
					<Grid item xs={2}>
						<h3>{info.symptomReports}</h3>
					</Grid>
					<Grid item xs={8}>
						<h4>Symptom Scores</h4>
					</Grid>
				</Grid>
				
			</Grid>
			<Grid item xs={3}>
				<Grid container spacing={0}>
					<Grid item xs={2}>
						<TrendingUpIcon fontSize="large"></TrendingUpIcon>
					</Grid>
					<Grid item xs={2}>
						<h3>{info.groundingActivations}</h3>
					</Grid>
					<Grid item xs={8}>
						<h4 style={{marginLeft: '15px'}}>Grounding Activations</h4>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={3}>
				<Button variant="contained">View Patient Data<ArrowRightAlt></ArrowRightAlt></Button>
			</Grid>
		</Grid>
	);
}

function ClientGrid(props)
{
	let clientList= props.clientList;
	let clientStats = props.clientStats;
	const clientInfoList = [];
	const clientIDs = Object.keys(clientList);
	for (let index=0; index < clientIDs.length; index++) {
		const id = clientIDs[index];
		const name = clientList[id];
		// prevent crash on undefined
		if (!clientStats || !clientStats.idObjects) {
			break;
		}
		const stat = clientStats.idObjects[id];
		// prevent crash of trying to read data of null
		if (stat === null || stat === undefined) {
			break
		}
		clientInfoList.push(
			<div className="individualRow">
				<ClientRow id={id} name={name} groundingActivations={stat.groundingActivations.allTime} symptomReports={stat.symptomReports.allTime}></ClientRow>
			</div>
		)
	}

	return(
		<Box>
			<Grid container spacing={0} className="outer-grid" justifyContent="space-evenly">
				{clientInfoList}
			</Grid>
		</Box>
	);
}

export default Home;
