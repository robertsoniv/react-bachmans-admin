import { createStyles, Theme, withStyles, Fade } from "@material-ui/core";
import React from "react";
import { Route, Switch } from "react-router-dom";
import DummyComponent from "../Dummy/DummyComponent";
import OrderManagement from "../Orders/OrderManagement";
import Profile from "../Profile/Profile";
import { AppContext } from "../../App.context";
import PermissionGroupManagement from "../AdminTools/PermissionGroups/PermissionGroupManagement";
import PermissionGroupForm from "../AdminTools/PermissionGroups/PermissionGroupForm";
import AdminUserManagement from "../AdminUsers/AdminUserManagement";
import AdminUserForm from "../AdminUsers/AdminUserForm";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      zIndex: 1,
      backgroundColor: theme.palette.background.default,
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
            <Route path="/admin/users" exact component={AdminUserManagement} />
            <Route path="/admin/users/create" exact component={AdminUserForm} />
            <Route path="/admin/users/:id" exact component={AdminUserForm} />
            <Route
              path="/admin/roles"
              exact
              component={PermissionGroupManagement}
            />
            <Route
              path="/admin/roles/create"
              exact
              component={PermissionGroupForm}
            />
            <Route
              path="/admin/roles/:groupId"
              component={PermissionGroupForm}
            />
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
