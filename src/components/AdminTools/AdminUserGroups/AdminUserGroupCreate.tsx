import {
  AppBar,
  createStyles,
  Theme,
  Toolbar,
  Typography,
  withStyles
} from "@material-ui/core";
import { ChevronLeft } from "@material-ui/icons";
import {
  AdminUserGroups,
  AdminUsers,
  User,
  UserGroup,
  SecurityProfiles
} from "ordercloud-javascript-sdk";
import React from "react";
import { RouteComponentProps } from "react-router";
import IconButtonLink from "../../Shared/IconButtonLink";
import AdminUserGroupForm from "./AdminUserGroupForm";

interface AdminUserGroupCreateProps extends RouteComponentProps {
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

const initialUserGroup: UserGroup = {
  ID: "",
  Name: "",
  Description: "",
  xp: {
    IsPermissionGroup: true
  }
};

class AdminUserGroupCreate extends React.Component<AdminUserGroupCreateProps> {
  public handleFormSubmit = (
    newUserGroup: User,
    selectedProfiles: string[]
  ) => {
    return AdminUserGroups.Create({
      ...newUserGroup
    }).then(savedUserGroup => {
      Promise.all(
        selectedProfiles.map(profileID => {
          return SecurityProfiles.SaveAssignment({
            UserGroupID: savedUserGroup.ID,
            SecurityProfileID: profileID
          });
        })
      ).then(() => {
        const { history } = this.props;
        history.push(`/admin/roles/${savedUserGroup.ID}`);
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
            <IconButtonLink className={classes.iconButton} to="/admin/roles">
              <ChevronLeft />
            </IconButtonLink>
            <div className={classes.spacer} />
            <Typography variant="h6">New Internal User Role</Typography>
          </Toolbar>
        </AppBar>
        <AdminUserGroupForm
          userGroup={initialUserGroup}
          onSubmit={this.handleFormSubmit}
        />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(AdminUserGroupCreate);
