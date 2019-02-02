import {
  AppBar,
  createStyles,
  IconButton,
  Theme,
  Toolbar,
  Typography,
  withStyles,
  Button,
  Fade,
  Slide
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationIcon from "@material-ui/icons/Notifications";
import React from "react";

const styles = (theme: Theme) =>
  createStyles({
    root: {
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
    }
  });

interface AppHeaderProps {
  classes: any;
  onLogout: () => void;
  onDrawerToggle: () => void;
}

class AppHeader extends React.Component<AppHeaderProps> {
  render() {
    const { classes, onDrawerToggle, onLogout } = this.props;
    return (
      <Slide direction="down" in={true}>
        <AppBar position="fixed" className={classes.root}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={onDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              Bachman's Admin
            </Typography>
            <div className={classes.grow} />
            <Button onClick={onLogout} color="inherit">
              Logout
            </Button>
            <IconButton color="inherit">
              <NotificationIcon />
            </IconButton>
            <IconButton color="inherit">
              <AccountCircleIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Slide>
    );
  }
}

export default withStyles(styles)(AppHeader);
