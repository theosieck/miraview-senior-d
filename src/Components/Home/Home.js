import React from 'react';
//import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Paper } from '@material-ui/core';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PeopleIcon from '@mui/icons-material/People';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
//import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
const useStyles = makeStyles({
	paper: {
		textAlign: 'center',
	}
});

function Home () {
	<h1>Home Page</h1>;
	const classes = useStyles();

	return (
		<div style={{ width: '90%', padding: '10px' }}>
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
	)
		   
}

export default Home;
