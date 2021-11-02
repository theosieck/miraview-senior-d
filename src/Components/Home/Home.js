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
const useStyles = makeStyles({
	paper: {
		textAlign: 'center',
	}
});



function Home () {
	// redirect to / if not logged in
	const userData = useSelector((state) => state.user);
	console.log(userData);
	if (!userData.loggedIn) return <Redirect to='/'/>;

	// testing to make sure auth will work across pages
	const testFN = async () => {
		const res = await getClientsList(null, auth);
		console.log(res);
	}

	testFN();
	
	return(
		<div>
			<ClientOverview/>
			<ClientGrid></ClientGrid>
		</div>
	);	   
}

function ClientOverview()
{
	const classes = useStyles();
	return (
		<div style={{ width: '70%', padding: '5px'}}>
			<Box>
				<Grid container spacing={3}>
					<Grid item xs={6} sm={3}>
						<Paper className={classes.paper}>My Clients
						</Paper>
					</Grid>
					<Grid item xs={6} sm={3}>
						<Paper className={classes.paper}>
							<PlayArrowIcon fontSize="small"></PlayArrowIcon>3 Active Today</Paper>
					</Grid>
					<Grid item xs={6} sm={3}>
						<Paper className={classes.paper}><PeopleIcon fontSize="small"></PeopleIcon>13 Active Clients</Paper>
					</Grid>
					<Grid item xs={6} sm={3}>
						<Paper className={classes.paper}><ArrowUpwardIcon fontSize="small"></ArrowUpwardIcon>+10% Grounding Activations</Paper>
					</Grid>
				</Grid>
			</Box>
		</div>
	);
}

function ClientRow(props)
{
	const {
		name
	} = props;
	return (
		<Grid container>
			<Grid item xs={3}>
				<Grid container spacing={0}>
					<Grid item xs={3}>
						<Avatar/>
					</Grid>
					<Grid item xs={9}>
						<h3 className="name">{name}</h3>
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
						<h3>-5%</h3>
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
						<h3>+10%</h3>
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

function ClientGrid()
{
	const names = ['Nicholas Gattuso', 'Essence Peters', 'Derek Morris', 'Alex Conetta', 'Gene Donovan', 'Alex Stupar', 'Nicholas Gattuso'];
	const clientList = names.map((name, index) =>
		<div className="individualRow">
			<ClientRow name={name}></ClientRow>
		</div>
		);

	return(
		<Box>
			<Grid container spacing={0} className="outer-grid" justifyContent="space-evenly">
				{clientList}
			</Grid>
		</Box>
	);
}

export default Home;
