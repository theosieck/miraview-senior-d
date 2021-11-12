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

import {auth, getClientsList} from '../../firebase/Firebase';
//import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

function Home () {
	// redirect to / if not logged in
	const userData = useSelector((state) => state.user);
	console.log(userData);

	const clientsStatisticsData = useSelector((state) => state.clientStatistics);
	console.log(clientsStatisticsData);

	const clientListData = useSelector((state) => state.clientsList);
	console.log(clientListData);
	let clients;
	if (clientListData && clientListData.clients) ({clients} = clientListData);
	else clients = {};

	if (!userData.loggedIn) return <Redirect to='/'/>;

	let activeClientsInfo = userData.data.data.data.clients.length;
	// testing to make sure auth will work across pages
	const testFN = async () => {
		const res = await getClientsList(null, auth);
	}

	testFN();
	
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
	console.log(clientList);
	for (let index=0;index<clientIDs.length;index++) {
		const id = clientIDs[index];
		const name = clientList[id];
		clientInfoList.push(
			<div className="individualRow">
				<ClientRow id={id} name={name} groundingActivations={clientStats.groundingActivations[index] ? clientStats.groundingActivations[index].allTime : 0} symptomReports={clientStats.symptomReports[index] ? clientStats.symptomReports[index].allTime : 0}></ClientRow>
			</div>
		)
	}
	console.log(clientInfoList);
	// const clientInfoList = clientList.map(({id, name}, index) =>
	// 	<div className="individualRow">
	// 		<ClientRow id={id} name={name} groundingActivations={clientStats.groundingActivations[index] ? clientStats.groundingActivations[index].allTime : 0} symptomReports={clientStats.symptomReports[index] ? clientStats.symptomReports[index].allTime : 0}></ClientRow>
	// 	</div>
	// 	);

	return(
		<Box>
			<Grid container spacing={0} className="outer-grid" justifyContent="space-evenly">
				{clientInfoList}
			</Grid>
		</Box>
	);
}

export default Home;
