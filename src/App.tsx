import React from "react";
import {
  AppBar,
  createStyles,
  CssBaseline,
  Drawer,
  Hidden,
  IconButton,
  Theme,
  Toolbar,
  Typography,
  withStyles
} from "@material-ui/core";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import NotificationIcon from "@material-ui/icons/Notifications";
import MenuIcon from "@material-ui/icons/Menu";

import LeftDrawerContent from "./LeftDrawer/LeftDrawerContent";
import OrderManagement from "./Orders/OrderManagement";
import DummyComponent from "./DummyComponent";

const drawerWidth = 300;

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0
      }
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1
    },
    grow: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: 20,
      [theme.breakpoints.up("sm")]: {
        display: "none"
      }
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      top: theme.spacing.unit * 8,
      height: "calc(100% - " + theme.spacing.unit * 8 + "px)",
      width: drawerWidth
    },
    drawerPaperMobile: {
      width: drawerWidth
    },
    content: {
      flexGrow: 1
    },
    nested: {
      paddingTop: theme.spacing.unit,
      "&:not(:last-of-type)": {
        paddingBottom: theme.spacing.unit
      }
    }
  });

interface AppProps {
  classes: any;
  theme: any;
}

interface AppState {
  mobileOpen: boolean;
}

class App extends React.Component<AppProps, AppState> {
  state = {
    mobileOpen: false
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  render() {
    const { classes, theme } = this.props;
    return (
      <Router>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerToggle}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" noWrap>
                Bachman's Admin
              </Typography>
              <div className={classes.grow} />
              <IconButton color="inherit">
                <NotificationIcon />
              </IconButton>
              <IconButton color="inherit">
                <AccountCircleIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <nav className={classes.drawer}>
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Hidden smUp implementation="js">
              <Drawer
                variant="temporary"
                anchor={theme.direction === "rtl" ? "right" : "left"}
                open={this.state.mobileOpen}
                onClose={this.handleDrawerToggle}
                classes={{
                  paper: classes.drawerPaperMobile
                }}
              >
                <LeftDrawerContent />
              </Drawer>
            </Hidden>
            <Hidden xsDown implementation="js">
              <Drawer
                classes={{
                  paper: classes.drawerPaper
                }}
                variant="permanent"
                open
              >
                <LeftDrawerContent />
              </Drawer>
            </Hidden>
          </nav>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Switch>
              <Route path="/orders/build" exact component={DummyComponent} />
              <Route path="/orders/:tab?" component={OrderManagement} />
            </Switch>
          </main>
        </div>
      </Router>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
