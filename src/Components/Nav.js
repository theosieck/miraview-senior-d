import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Button, Grid, Tabs, Tab, Toolbar, makeStyles } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { signOut } from 'firebase/auth';
import logo from './MiraLogo_1000px.png';
import { auth } from '../firebase/Firebase';
import { logout } from '../slices/userSlice';

const useStyles = makeStyles({
    tab: {
        color: '#FFFFFF',
        fontSize: 'small'
    },
    appbar: {
        backgroundColor: "#04b3dc"
    },
    logoutButton: {
        verticalAlign: 'bottom',
        backgroundColor: '#3e83dc',
        color: '#FFFFFF',
        '&:hover': {
            backgroundColor: '#fff',
            color: '#3e83dc',
        },
    },
    logo: {
        maxWidth: 80
    }
});

function Nav(props) {
	const dispatch = useDispatch();
    const [value, setValue] = React.useState(0);
    const classes = useStyles();
    const tabs = ['/home', '/population', '/manage', '/settings'];
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    useEffect(() => {
        // get the page we're on
        const newValue = window.location.pathname;
        console.log(newValue);

        // get its position in the menu
        const newIndex = tabs.indexOf(newValue);
        // if it exists in the menu, set the new active value
        if (newIndex>=0) setValue(newIndex);
    }, [window.location.pathname]);

    const logUserOut = async () => {
        console.log('logging out...');
        // log user out in firebase
        signOut(auth);
        // send dispatch to log user out in redux
        dispatch({
            type: 'LOG_OUT'
        });
        // send dispatch to clear client statistics in redux
        dispatch({
            type: 'CLEAR_CLIENT_STATISTICS_DATA'
        })
    }

    return <nav>
        <AppBar className={classes.appbar} position="static" color="default">
            <Toolbar>
                <Grid alignItems="center" justify={"space-between"} container>
                    <Grid xs={1} sm={1} md={1} item>
                        <img className={classes.logo} src={logo} alt="Mira Logo"/>
                    </Grid>
                    <Grid xs={10} sm={10} md={10} item>
                            <Tabs
                                onChange={handleChange}
                                value={value}
                                aria-label="Navigation Tabs"
                                TabIndicatorProps={{style: {backgroundColor: "white"}}}
                            >
                                <Tab
                                    className={classes.tab}
                                    label={"Home"} 
                                    component={Link}
                                    to={"/home"}
                                />
                                <Tab
                                    className={classes.tab}
                                    label={"Population"}
                                    component={Link}
                                    to={"/population"}
                                />
                                <Tab
                                    className={classes.tab}
                                    label={"Manage"}
                                    component={Link}
                                    to={"/manage"}
                                />
                                <Tab
                                    className={classes.tab}
                                    label={"Settings"}
                                    component={Link}
                                    to={"/settings"}
                                />
                            </Tabs>
                        </Grid>
                    <Grid item xs={1} sm={1} md={1}>
                        <Button className={classes.logoutButton} variant="contained" onClick={logUserOut}>Log Out</Button>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    </nav>
}

export default Nav;