import {
  createStyles,
  Drawer,
  Hidden,
  Theme,
  withStyles,
  Fade,
  Slide
} from "@material-ui/core";
import React from "react";
import LeftDrawerContent from "./LeftDrawerContent";

export const drawerWidth = 300;

const styles = (theme: Theme) =>
  createStyles({
    root: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0
      }
    },
    drawerPaper: {
      top: theme.spacing.unit * 8,
      height: "calc(100% - " + theme.spacing.unit * 8 + "px)",
      width: drawerWidth
    },
    drawerPaperMobile: {
      width: drawerWidth
    }
  });

interface LeftDrawerProps {
  classes: any;
  mobileOpen: boolean;
  onToggle: () => void;
}

class LeftDrawer extends React.Component<LeftDrawerProps> {
  render() {
    const { classes } = this.props;
    return (
      <Fade in={true}>
        <nav className={classes.root}>
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden smUp implementation="js">
            <Drawer
              variant="temporary"
              open={this.props.mobileOpen}
              onClose={this.props.onToggle}
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
      </Fade>
    );
  }
}

export default withStyles(styles)(LeftDrawer);
