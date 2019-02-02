import { createStyles, Theme, withStyles, Fade } from "@material-ui/core";
import React from "react";
import { Route, Switch } from "react-router-dom";
import DummyComponent from "../Dummy/DummyComponent";
import OrderManagement from "../Orders/OrderManagement";
import Profile from "../Profile/Profile";
import { AppContext } from "../../App.context";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      minHeight: "calc(100vh - " + theme.spacing.unit * 8 + "px)"
    },
    toolbar: theme.mixins.toolbar
  });

interface MainContentProps {
  classes: any;
}

class MainContent extends React.Component<MainContentProps> {
  render() {
    const { classes } = this.props;
    return (
      <Fade in={true}>
        <main className={classes.root}>
          <div className={classes.toolbar} />
          <Switch>
            <Route path="/orders/build" exact component={DummyComponent} />
            <Route path="/orders/:tab?" component={OrderManagement} />
            <AppContext.Consumer>
              {context => (
                <Route
                  path="/profile"
                  render={props => <Profile {...props} user={context.user} />}
                />
              )}
            </AppContext.Consumer>
          </Switch>
        </main>
      </Fade>
    );
  }
}

export default withStyles(styles)(MainContent);
