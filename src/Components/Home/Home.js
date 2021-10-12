import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Paper } from '@material-ui/core';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PeopleIcon from '@mui/icons-material/People';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Button from '@mui/material/Button';
import ArrowRightAlt from '@mui/icons-material/ArrowRightAlt';
//import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
const useStyles = makeStyles({
	paper: {
		textAlign: 'center',
	}
});



function Home () {

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

function ClientGrid()
{
	const names = ['Nicholas Gattuso', 'Essence Peters', 'Derek Morris', 'Alex Conetta', 'Gene Donovan', 'Alex Stupar', 'Nicholas Gattuso'];

	const clientList = names.map((name, index) =>
		<Grid container spacing={0} xs={8}>
			<Grid item xs={3}>
				<h3>{name}</h3>
				<h4>Age: 42</h4>
			</Grid>
			<Grid item xs={3}>
				<Grid container spacing={0}>
					<Grid item xs={4}>
						<TrendingDownIcon fontSize="small"></TrendingDownIcon>
					</Grid>
					<Grid item xs={4}>
						<h3>-5%</h3>
					</Grid>
					<Grid item xs={4}>
						<h4>Symptom</h4>
						<h4>Scores</h4>
					</Grid>
				</Grid>
				
			</Grid>
			<Grid item xs={3}>
				<Grid container spacing={0}>
					<Grid item xs={4}>
						<TrendingUpIcon fontSize="small"></TrendingUpIcon>
					</Grid>
					<Grid item xs={4}>
						<h3>+10%</h3>
					</Grid>
					<Grid item xs={4}>
						<h4>Grounding</h4>
						<h4>Activations</h4>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={3}>
				<Button>View Patient Data<ArrowRightAlt></ArrowRightAlt></Button>
			</Grid>
		</Grid>);

	return(
		<Box>
			<Grid container spacing={0}>
				{clientList}
			</Grid>
		</Box>
	);
}

export default Home;
