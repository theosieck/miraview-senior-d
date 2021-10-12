import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Button, Grid, Tabs, Tab, Toolbar, makeStyles } from '@material-ui/core';

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
    }
});

function Nav() {
    const [value, setValue] = React.useState(0);
    const classes = useStyles();
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    return <nav>
        <AppBar className={classes.appbar} position="static" color="default">
            <Toolbar>
                <Grid justify={"space-between"} container>
                    <Grid xs={1} sm={1} md={1} item>
                        <img src="MiraLogo_1000px.png" alt="Mira Logo"/>
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
                        <Button className={classes.logoutButton} variant="contained">Log Out</Button>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    </nav>
}

export default Nav;