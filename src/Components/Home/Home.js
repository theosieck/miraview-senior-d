import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from 'react-router-dom';
import { Avatar, Box, CircularProgress, Grid } from '@material-ui/core';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PeopleIcon from '@mui/icons-material/People';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Button from '@mui/material/Button';
import ArrowRightAlt from '@mui/icons-material/ArrowRightAlt';
import { storeClientList, storeClientStatistics, storeUser } from '../../firebase/fetchData';

function Home () {
	const [loading, setLoading] = useState(true); 
	// pull data from redux store
	const userData = useSelector((state) => state.user);
	const clientsStatisticsData = useSelector((state) => state.clientStatistics);
	const clientListData = useSelector((state) => state.clientsList);
	const dispatch = useDispatch();
	// refetch data from firebase and store in redux
	useEffect(() => {
		storeClientList(dispatch);
		storeClientStatistics(dispatch);
		storeUser(dispatch);
		setLoading(false);
	}, []);

	// redirect to / if not logged in
	if (!userData.data) return <Redirect to='/'/>;

	if (loading) {
		return (
			<Grid
				container
				spacing={0}
				direction="column"
				alignItems="center"
				justifyContent="center"
				style={{ minHeight: '100vh' }}
			>
				<CircularProgress/>
			</Grid>
		);
	}

	let clients;
	if (clientListData && clientListData.clients) ({clients} = clientListData);
	else clients = {};

	let activeTodayClientsInfo = userData.data.numActiveClients;
	let activeClientsInfo = 0;
	if (userData && userData.data && userData.data.clients) activeClientsInfo = userData.data.clients.length;

	return(
		<div>
			<ClientOverview activeToday={activeTodayClientsInfo} activeClients={activeClientsInfo}/>
			<ClientGrid clientList={clients} clientStats={clientsStatisticsData}></ClientGrid>
		</div>
	);	   
}

function ClientOverview(props)
{
	let activeToday = props.activeToday;
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
						<PlayArrowIcon fontSize="small"></PlayArrowIcon>{activeToday} Active Today
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
	let groundingLastWeek, groundingPercentChange, symptomsLastWeek, symptomsPercentChange = 0;
	if (props && props.stats && props.stats.groundingActivations) 
	{
		groundingLastWeek = props.stats.groundingActivations.lastWeek;
		groundingPercentChange = props.stats.groundingActivations.percentChange;
	}
	if (props && props.stats && props.stats.symptomReports) 
	{
		symptomsLastWeek = props.stats.symptomReports.lastWeek;
		symptomsPercentChange = props.stats.symptomReports.percentChange;
	}
	const info = {
		clientName: props.name,
		email: props.stats.email,
		id: props.id,
		groundingActivations: groundingLastWeek,
		groundingPercent: groundingPercentChange,
		symptomReports: symptomsLastWeek,
		symptomsPercent: symptomsPercentChange
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
						<h4 className="email">{info.email.length <= 20 ? info.email : info.email.substring(0, 18) + "..."}</h4>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={3}>
				<Grid container spacing={0}>
					<Grid item xs={2}>
						<h3>{info.symptomReports}</h3>
					</Grid>
					<Grid item xs={6}>
						<h4>Symptom Scores</h4>
					</Grid>
				</Grid>
				<Grid container spacing={0}>
					<Grid item xs={2}>
						{info.symptomPercent > 0 ? <TrendingUpIcon/> : <TrendingDownIcon/>}
					</Grid>
					<Grid item xs={2}>
						<h4 className="percentChange">{info.symptomsPercent}%</h4>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={3}>
				<Grid container spacing={0}>
					<Grid item xs={2}>
						<h3>{info.groundingActivations}</h3>
					</Grid>
					<Grid item xs={6}>
						<h4 style={{marginLeft: '15px'}}>Grounding Activations</h4>
					</Grid>
				</Grid>
				<Grid container spacing={0}>
					<Grid item xs={2}>
						{info.groundingPercent > 0 ? <TrendingUpIcon/> : <TrendingDownIcon/>}
					</Grid>
					<Grid item xs={2}>
						<h4 className="percentChange">{info.groundingPercent}%</h4>
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
				<ClientRow id={id} name={name} stats={stat}></ClientRow>
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
