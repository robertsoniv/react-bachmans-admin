import {
  AppBar,
  Button,
  createStyles,
  Theme,
  Toolbar,
  Typography,
  withStyles
} from "@material-ui/core";
import { ChevronLeft } from "@material-ui/icons";
import { compact } from "lodash";
import {
  AdminUserGroups,
  AdminUsers,
  UserGroup,
  SecurityProfiles,
  ListSecurityProfileAssignment
} from "ordercloud-javascript-sdk";
import React from "react";
import { RouteComponentProps } from "react-router";
import ProtectedContent from "../../Layout/ProtectedContent";
import IconButtonLink from "../../Shared/IconButtonLink";
import OcConfirmDialog from "../../Shared/OcConfirmDialog";
import AdminUserGroupForm from "./AdminUserGroupForm";

interface AdminUserGroupDetailRouteProps {
  id: string;
}

interface AdminUserGroupDetailProps
  extends RouteComponentProps<AdminUserGroupDetailRouteProps> {
  classes: any;
  theme: Theme;
}

interface AdminUserGroupDetailState {
  userGroup: UserGroup;
  assignments: ListSecurityProfileAssignment;
  editing: boolean;
  confirmDeleteOpen: boolean;
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

class AdminUserGroupDetail extends React.Component<
  AdminUserGroupDetailProps,
  AdminUserGroupDetailState
> {
  public componentDidMount = () => {
    const userGroupID = this.props.match.params.id;
    AdminUserGroups.Get(userGroupID)
      .then(userGroup => {
        SecurityProfiles.ListAssignments({
          pageSize: 100,
          userGroupID
        }).then(assignments => {
          this.setState({
            assignments,
            userGroup,
            confirmDeleteOpen: false,
            editing: false
          });
        });
      })
      .catch(error => {
        const { history } = this.props;
        history.push("/admin/roles");
      });
  };

  public rolesToRemove = (selected: string[]) => {
    const { assignments } = this.state;
    return compact(
      assignments.Items!.map(a => {
        if (!selected.includes(a.SecurityProfileID!)) {
          return a.SecurityProfileID;
        }
      })
    );
  };

  public rolesToAdd = (selected: string[]) => {
    const { assignments } = this.state;
    return compact(
      selected.map(s => {
        if (!assignments.Items!.filter(a => a.SecurityProfileID === s).length) {
          return s;
        }
      })
    );
  };

  public handleFormSubmit = (
    newUserGroup: UserGroup,
    selectedProfiles: string[]
  ) => {
    return AdminUserGroups.Save(this.state.userGroup.ID!, {
      ...newUserGroup
    }).then(savedUserGroup => {
      var queue = new Array();
      this.rolesToAdd(selectedProfiles).forEach(profileID => {
        queue.push(
          SecurityProfiles.SaveAssignment({
            SecurityProfileID: profileID,
            UserGroupID: savedUserGroup.ID
          })
        );
      });
      this.rolesToRemove(selectedProfiles).forEach(profileID => {
        queue.push(
          SecurityProfiles.DeleteAssignment(profileID, {
            userGroupID: savedUserGroup.ID
          })
        );
      });

      Promise.all(queue).finally(() => {
        SecurityProfiles.ListAssignments({
          pageSize: 100,
          userGroupID: savedUserGroup.ID
        }).then(assignments => {
          this.setState({
            userGroup: savedUserGroup,
            editing: false,
            assignments
          });

          const { history, match } = this.props;
          if (savedUserGroup.ID !== match.params.id) {
            history.push(`/admin/roles/${savedUserGroup.ID}`);
          }
        });
      });
    });
  };

  public handleEditToggle = (event: React.MouseEvent) => {
    this.setState(state => ({ editing: !state.editing }));
  };

  public handleDeleteClick = (event: React.MouseEvent) => {
    this.setState({ confirmDeleteOpen: true });
  };

  public handleDeleteConfirm = () => {
    this.setState({ confirmDeleteOpen: false });
    AdminUserGroups.Delete(this.state.userGroup.ID!).then(() => {
      const { history } = this.props;
      history.push("/admin/roles");
    });
  };

  public handleDeleteCancel = () => {
    this.setState({ confirmDeleteOpen: false });
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
            {this.state && this.state.userGroup && (
              <Typography variant="h6">{this.state.userGroup.Name}</Typography>
            )}
            <div className={classes.grow} />
            <ProtectedContent
              hasAccess={p => p.includes("feature-internal-user-admin")}
            >
              <React.Fragment>
                <Button onClick={this.handleDeleteClick} variant="outlined">
                  Delete
                </Button>
                {this.state && (
                  <OcConfirmDialog
                    open={this.state.confirmDeleteOpen}
                    title="Delete Internal User Role"
                    confirmText="Delete User"
                    cancelText="Cancel"
                    onConfirm={this.handleDeleteConfirm}
                    onCancel={this.handleDeleteCancel}
                    message={`Are you sure you want to permanently delete ${
                      this.state.userGroup.Name
                    }? This action cannot be undone. All Internal Users assigned to this role will lose the permissions associated with it.`}
                  />
                )}
                <div className={classes.spacer} />
                <Button
                  onClick={this.handleEditToggle}
                  variant="outlined"
                  color={
                    this.state && this.state.editing ? "default" : "primary"
                  }
                >
                  {this.state && this.state.editing
                    ? "Discard Changes"
                    : "Edit User"}
                </Button>
              </React.Fragment>
            </ProtectedContent>
          </Toolbar>
        </AppBar>
        {this.state && this.state.userGroup && this.state.assignments && (
          <AdminUserGroupForm
            userGroup={this.state.userGroup}
            assignments={this.state.assignments}
            disabled={!this.state.editing}
            onSubmit={this.handleFormSubmit}
          />
        )}
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(AdminUserGroupDetail);
