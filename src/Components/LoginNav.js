import React from 'react';
import { AppBar, Grid, Toolbar, makeStyles } from '@material-ui/core';
import logo from './MiraLogo_1000px.png';


const useStyles = makeStyles({
    tab: {
        color: '#FFFFFF',
        fontSize: 'small'
    },
    appbar: {
        backgroundColor: "#04b3dc"
    },
    logo: {
        maxWidth: 80
    }
});

function LoginNav() {
    const classes = useStyles();

    return <nav>
        <AppBar className={classes.appbar} position="static" color="default">
            <Toolbar>
                <Grid alignItems="center" justify={"space-between"} container>
                    <Grid xs={1} sm={1} md={1} item>
                        <img className={classes.logo} src={logo} alt="Mira Logo"/>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    </nav>
}

export default LoginNav;