import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Button, Grid, Tabs, Tab, Toolbar, makeStyles } from '@material-ui/core';
import { useDispatch } from 'react-redux';
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

function LoginNav(props) {
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