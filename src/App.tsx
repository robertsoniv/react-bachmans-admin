import React, { Component } from "react";
import {
  AppBar,
  createStyles,
  CssBaseline,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Theme,
  Toolbar,
  Typography,
  withStyles,
  Icon,
  Collapse,
  ListItemSecondaryAction,
  Link
} from "@material-ui/core";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  NavLink
} from "react-router-dom";

import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import NotificationIcon from "@material-ui/icons/Notifications";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import MenuIcon from "@material-ui/icons/Menu";

import ComponentRoutes from "./constants/Navigation.constants";

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
  expandedMenuItems: string[];
}

class App extends React.Component<AppProps, AppState> {
  state = {
    mobileOpen: false,
    expandedMenuItems: new Array()
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  toggleMenuItemChildren = (path: string) => (event: React.MouseEvent) => {
    this.setState(state => {
      const newExpandedMenuItems = state.expandedMenuItems.includes(path)
        ? state.expandedMenuItems.filter(p => p !== path)
        : [...state.expandedMenuItems, path];
      return { expandedMenuItems: newExpandedMenuItems };
    });
  };

  getNavLink = (path: string, component: any, parentPath?: string) => (
    props: any
  ) => {
    let to = "";
    if (parentPath) {
      to = parentPath;
      to += path;
    } else if (component.children) {
      to = path;
      to += Object.keys(component.children)[0];
    } else {
      to = path;
    }
    return <NavLink to={to} {...props} />;
  };

  render() {
    const { classes, theme } = this.props;

    const drawer = (
      <List>
        {Object.entries(ComponentRoutes).map(
          ([path, component]: [string, any], index) => (
            <React.Fragment key={path}>
              <ListItem component={this.getNavLink(path, component)} button>
                <ListItemIcon>
                  <Icon component={component.icon} />
                </ListItemIcon>
                <ListItemText primary={component.label} />
                {component.children && (
                  <ListItemSecondaryAction>
                    <IconButton onClick={this.toggleMenuItemChildren(path)}>
                      {this.state.expandedMenuItems.includes(path) ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
              {component.children && (
                <Collapse
                  in={this.state.expandedMenuItems.includes(path)}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="span" disablePadding>
                    {Object.entries(component.children).map(
                      ([childPath, childComponent]: [string, any], index) => (
                        <ListItem
                          component={this.getNavLink(
                            childPath,
                            childComponent,
                            path
                          )}
                          key={childPath}
                          button
                          className={classes.nested}
                        >
                          <ListItemText inset primary={childComponent.label} />
                        </ListItem>
                      )
                    )}
                  </List>
                </Collapse>
              )}
              <Divider />
            </React.Fragment>
          )
        )}
      </List>
    );

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
                {drawer}
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
                {drawer}
              </Drawer>
            </Hidden>
          </nav>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Switch>
              {Object.entries(ComponentRoutes).map(
                ([path, component]: [string, any], index) =>
                  Object.entries(component.children).map(
                    ([childPath, childComponent]: [string, any], index) => (
                      <Route
                        exact
                        path={path + childPath}
                        component={childComponent.$ref || component.$ref}
                      />
                    )
                  )
              )}
            </Switch>
          </main>
        </div>
      </Router>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
