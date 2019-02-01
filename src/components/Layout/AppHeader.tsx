import {
  AppBar,
  createStyles,
  IconButton,
  Theme,
  Toolbar,
  Typography,
  withStyles
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationIcon from "@material-ui/icons/Notifications";
import React from "react";
import { AppContext } from "../../App.context";

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
  onDrawerToggle: () => void;
}

class AppHeader extends React.Component<AppHeaderProps> {
  render() {
    const { classes, onDrawerToggle } = this.props;
    return (
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
          <IconButton color="inherit">
            <NotificationIcon />
          </IconButton>
          <IconButton color="inherit">
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(AppHeader);
