import {
  AppBar,
  createStyles,
  Theme,
  Toolbar,
  Typography,
  withStyles
} from "@material-ui/core";
import { ChevronLeft } from "@material-ui/icons";
import { AdminUserGroups, AdminUsers, User } from "ordercloud-javascript-sdk";
import React from "react";
import { RouteComponentProps } from "react-router";
import IconButtonLink from "../../Shared/IconButtonLink";
import AdminUserForm from "./AdminUserForm";

interface AdminUserCreateProps extends RouteComponentProps {
  classes: any;
  theme: Theme;
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      position: "relative"
    },
    appBar: {
      top: theme.spacing.unit * 7,
      background: theme.palette.background.paper,
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    iconButton: {
      padding: 10
    },
    grow: {
      flexGrow: 1
    },
    spacer: {
      width: theme.spacing.unit
    }
  });

const initialUser: User = {
  Username: "",
  FirstName: "",
  LastName: "",
  Email: "",
  Password: "",
  Active: false,
  xp: {
    StoreAddressID: ""
  }
};

class AdminUserCreate extends React.Component<AdminUserCreateProps> {
  public handleFormSubmit = (newUser: User, selectedRoles: string[]) => {
    return AdminUsers.Create({
      ID: newUser.Username,
      ...newUser
    }).then(savedUser => {
      Promise.all(
        selectedRoles.map(roleID => {
          return AdminUserGroups.SaveUserAssignment({
            UserGroupID: roleID,
            UserID: savedUser.ID
          });
        })
      ).then(() => {
        const { history } = this.props;
        history.push(`/admin/users/${savedUser.ID}`);
      });
    });
  };

  public render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar
          color="default"
          position="sticky"
          className={classes.appBar}
          elevation={0}
        >
          <Toolbar>
            <IconButtonLink className={classes.iconButton} to="/admin/users">
              <ChevronLeft />
            </IconButtonLink>
            <div className={classes.spacer} />
            <Typography variant="h6">New Internal User</Typography>
          </Toolbar>
        </AppBar>
        <AdminUserForm user={initialUser} onSubmit={this.handleFormSubmit} />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(AdminUserCreate);
