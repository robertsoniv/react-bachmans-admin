import { createStyles, Theme, withStyles, Fade } from "@material-ui/core";
import React from "react";
import { Route, Switch } from "react-router-dom";
import DummyComponent from "../Dummy/DummyComponent";
import OrderManagement from "../Orders/OrderManagement";
import Profile from "../Profile/Profile";
import { AppContext } from "../../App.context";
import AdminUserGroupManagement from "../AdminTools/AdminUserGroups/AdminUserGroupManagement";
import AdminUserGroupForm from "../AdminTools/AdminUserGroups/AdminUserGroupForm";
import AdminUserManagement from "../AdminTools/AdminUsers/AdminUserManagement";
import AdminUserForm from "../AdminTools/AdminUsers/AdminUserForm";
import AdminTools from "../AdminTools/AdminTools";
import AdminUserDetail from "../AdminTools/AdminUsers/AdminUserDetail";
import ProtectedRoute from "./ProtectedRoute";
import AdminUserCreate from "../AdminTools/AdminUsers/AdminUserCreate";
import AdminUserGroupCreate from "../AdminTools/AdminUserGroups/AdminUserGroupCreate";
import AdminUserGroupDetail from "../AdminTools/AdminUserGroups/AdminUserGroupDetail";

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
            <ProtectedRoute
              path="/admin"
              exact
              component={AdminTools}
              permission={[
                "feature-internal-user-admin",
                "feature-internal-user-reader"
              ]}
            />
            <ProtectedRoute
              path="/admin/users"
              exact
              component={AdminUserManagement}
              permission={[
                "feature-internal-user-admin",
                "feature-internal-user-reader"
              ]}
            />
            <ProtectedRoute
              path="/admin/users/create"
              exact
              permission={["feature-internal-user-admin"]}
              component={AdminUserCreate}
            />
            <ProtectedRoute
              path="/admin/users/:id"
              exact
              permission={[
                "feature-internal-user-admin",
                "feature-internal-user-reader"
              ]}
              component={AdminUserDetail}
            />
            <ProtectedRoute
              path="/admin/roles"
              exact
              component={AdminUserGroupManagement}
              permission={[
                "feature-internal-user-admin",
                "feature-internal-user-reader"
              ]}
            />
            <ProtectedRoute
              path="/admin/roles/create"
              exact
              permission={["feature-internal-user-admin"]}
              component={AdminUserGroupCreate}
            />
            <ProtectedRoute
              path="/admin/roles/:id"
              exact
              permission={[
                "feature-internal-user-admin",
                "feature-internal-user-reader"
              ]}
              component={AdminUserGroupDetail}
            />
            <AppContext.Consumer>
              {context => (
                <React.Fragment>
                  <Route
                    path="/profile"
                    render={props => <Profile {...props} user={context.user} />}
                  />
                </React.Fragment>
              )}
            </AppContext.Consumer>
          </Switch>
        </main>
      </Fade>
    );
  }
}

export default withStyles(styles)(MainContent);
