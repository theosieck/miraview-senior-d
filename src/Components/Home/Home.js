import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Grid, makeStyles } from '@material-ui/core';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PeopleIcon from '@mui/icons-material/People';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

function Home () {
	return <h1>Home Page</h1>;
}

return(
	<div>
		<Box>
			<Grid container spacing={3}>
				<Grid item xs={6} sm={3}>
					<Paper className={classes.paper}>My Clients
					</Paper>
				</Grid>
				<Grid item xs={6} sm={3}>
					<PlayArrowIcon fontSize="small"></PlayArrowIcon>
					<Paper className={classes.paper}>3 Active Today</Paper>
				</Grid>
				<Grid item xs={6} sm={3}>
					<PeopleIcon fontSize="small"></PeopleIcon>
					<Paper className={classes.paper}>13 Active Clients</Paper>
				</Grid>
				<Grid item xs={6} sm={3}>
					<ArrowUpwardIcon fontSize="small"></ArrowUpwardIcon>
					<Paper className={classes.paper}>+10% Grounding Activations</Paper>
				</Grid>
			</Grid>
		</Box>
	</div>   
)
export default Home;
