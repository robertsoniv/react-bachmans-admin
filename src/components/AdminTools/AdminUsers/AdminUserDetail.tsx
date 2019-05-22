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
  ListUserGroupAssignment,
  User
} from "ordercloud-javascript-sdk";
import React from "react";
import { RouteComponentProps } from "react-router";
import ProtectedContent from "../../Layout/ProtectedContent";
import IconButtonLink from "../../Shared/IconButtonLink";
import AdminUserForm from "./AdminUserForm";
import OcConfirmDialog from "../../Shared/OcConfirmDialog";

interface AdminUserDetailRouteProps {
  id: string;
}

interface AdminUserDetailProps
  extends RouteComponentProps<AdminUserDetailRouteProps> {
  classes: any;
  theme: Theme;
}

interface AdminUserDetailState {
  user: User;
  assignments: ListUserGroupAssignment;
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
    [theme.breakpoints.up("sm")]: {
      appBar: {
        top: theme.spacing.unit * 8
      }
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

class AdminUserDetail extends React.Component<
  AdminUserDetailProps,
  AdminUserDetailState
> {
  public componentDidMount = () => {
    const userID = this.props.match.params.id;
    AdminUsers.Get(userID)
      .then(user => {
        AdminUserGroups.ListUserAssignments({
          pageSize: 100,
          userID
        }).then(assignments => {
          this.setState({
            assignments,
            user,
            confirmDeleteOpen: false,
            editing: false
          });
        });
      })
      .catch(error => {
        const { history } = this.props;
        history.push("/admin/users");
      });
  };

  public rolesToRemove = (selected: string[]) => {
    const { assignments } = this.state;
    return compact(
      assignments.Items!.map(a => {
        if (!selected.includes(a.UserGroupID!)) {
          return a.UserGroupID;
        }
      })
    );
  };

  public rolesToAdd = (selected: string[]) => {
    const { assignments } = this.state;
    return compact(
      selected.map(s => {
        if (!assignments.Items!.filter(a => a.UserGroupID === s).length) {
          return s;
        }
      })
    );
  };

  public handleFormSubmit = (newUser: User, selectedRoles: string[]) => {
    return AdminUsers.Save(this.props.match.params.id, {
      ...newUser,
      ID: newUser.Username
    }).then(savedUser => {
      var queue = new Array();
      this.rolesToAdd(selectedRoles).forEach(roleID => {
        queue.push(
          AdminUserGroups.SaveUserAssignment({
            UserID: savedUser.ID,
            UserGroupID: roleID
          })
        );
      });
      this.rolesToRemove(selectedRoles).forEach(roleID => {
        queue.push(AdminUserGroups.DeleteUserAssignment(roleID, savedUser.ID!));
      });

      Promise.all(queue).finally(() => {
        AdminUserGroups.ListUserAssignments({
          pageSize: 100,
          userID: savedUser.ID
        }).then(assignments => {
          this.setState({ user: savedUser, editing: false, assignments });

          const { history, match } = this.props;
          if (savedUser.ID !== match.params.id) {
            history.push(`/admin/users/${savedUser.ID}`);
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
    AdminUsers.Delete(this.state.user.ID!).then(() => {
      const { history } = this.props;
      history.push("/admin/users");
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
            <IconButtonLink className={classes.iconButton} to="/admin/users">
              <ChevronLeft />
            </IconButtonLink>
            <div className={classes.spacer} />
            {this.state && this.state.user && (
              <Typography variant="h6">{`${this.state.user.FirstName} ${
                this.state.user.LastName
              }`}</Typography>
            )}
            <div className={classes.grow} />
            <ProtectedContent
              hasAccess={p => p.includes("feature-internal-user-admin")}
            >
              <React.Fragment>
                {this.state && !this.state.user.Active && (
                  <React.Fragment>
                    <Button onClick={this.handleDeleteClick} variant="outlined">
                      Delete
                    </Button>
                    <OcConfirmDialog
                      open={this.state.confirmDeleteOpen}
                      title="Delete User"
                      confirmText="Delete User"
                      cancelText="Cancel"
                      onConfirm={this.handleDeleteConfirm}
                      onCancel={this.handleDeleteCancel}
                      message={`Are you sure you want to permanently delete ${
                        this.state.user.FirstName
                      } ${
                        this.state.user.LastName
                      }? This action cannot be undone.`}
                    />
                    <div className={classes.spacer} />
                  </React.Fragment>
                )}
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
        {this.state && this.state.user && this.state.assignments && (
          <AdminUserForm
            user={this.state.user}
            assignments={this.state.assignments}
            disabled={!this.state.editing}
            onSubmit={this.handleFormSubmit}
          />
        )}
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(AdminUserDetail);
