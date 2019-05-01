import React from "react";
import { RouteComponentProps } from "react-router";
import {
  Theme,
  createStyles,
  withStyles,
  TextField,
  Typography,
  Grid,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Paper,
  FormLabel,
  FormControl,
  Button
} from "@material-ui/core";
import {
  AdminUsers,
  AdminUserGroups,
  User,
  ListUserGroup,
  ListUserGroupAssignment,
  AdminAddresses,
  ListAddress
} from "ordercloud-javascript-sdk";
import { DEFAULT_OPTIONS } from "../AdminTools/PermissionGroups/PermissionGroupList";
import ContentLoading from "../Layout/ContentLoading";
import EnhancedTable, { EnhancedTableColumn } from "../Layout/EnhancedTable";
import ButtonLink from "../Layout/ButtonLink";
import OcPasswordField from "../Shared/OcPasswordField";

interface AdminUserFormRouteProps {
  id: string;
}

interface AdminUserFormProps
  extends RouteComponentProps<AdminUserFormRouteProps> {
  classes: any;
  theme: Theme;
}

interface AdminUserFormState {
  user: User;
  groups: ListUserGroup;
  assignments: ListUserGroupAssignment;
  selected: string[];
  newSelected: number[];
  stores: ListAddress;
  passwordConfirmation: string;
}

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

const groupTableColumns: EnhancedTableColumn[] = [
  {
    label: "Role",
    value: "Name"
  }
];

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing.unit * 3
    },
    formButtons: {
      display: "flex",
      flexFlow: "row nowrap"
    },
    spacer: {
      width: theme.spacing.unit
    }
  });

class AdminUserForm extends React.Component<
  AdminUserFormProps,
  AdminUserFormState
> {
  public componentDidMount = () => {
    const userID = this.props.match.params.id;

    this.setState({ passwordConfirmation: "" });

    AdminUserGroups.List(DEFAULT_OPTIONS).then(groups => {
      this.setState({ groups });
    });

    AdminAddresses.List({ pageSize: 100, filters: { ID: "Store-*" } }).then(
      stores => {
        this.setState({ stores });
      }
    );

    if (userID) {
      AdminUsers.Get(userID).then(user => {
        this.setState({ user: { ...initialUser, ...user } });
      });

      AdminUserGroups.ListUserAssignments({ pageSize: 100, userID }).then(
        assignments => {
          this.setState({
            assignments,
            selected: assignments.Items!.map(a => a.UserGroupID!)
          });
        }
      );
    } else {
      this.setState({ user: initialUser, selected: new Array() });
    }
  };

  public handleStoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState(state => {
      return {
        ...state,
        user: {
          ...state.user,
          xp: {
            ...state.user.xp,
            StoreAddressID: event.target.value
          }
        }
      };
    });
  };

  public handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isActive = event.target.checked;
    this.setState(state => {
      return {
        ...state,
        user: {
          ...state.user,
          Active: isActive
        }
      };
    });
  };

  public handleSelectionChange = (selected: number[]) => {
    this.setState({ newSelected: selected });
  };

  public handlePasswordChange = (password: string) => {
    console.log("pass change", password);
    this.setState(state => {
      return {
        ...state,
        user: {
          ...state.user,
          Password: password
        }
      };
    });
  };

  public handleInputChange = (key: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    this.setState(state => {
      return {
        ...state,
        user: {
          ...state.user,
          [key]: value
        }
      };
    });
  };

  public onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    AdminUsers.Save(this.state.user.ID || this.state.user.Username!, {
      ID: this.state.user.Username,
      ...this.state.user
    })
      .then(savedUser => {
        if (this.state.groups && this.state.groups.Items) {
          //update user assignments based on newSelected & selected
          this.state.groups.Items.forEach((group, index) => {
            if (
              this.state.newSelected.indexOf(index) > -1 &&
              !this.state.selected.includes(group.ID!)
            ) {
              AdminUserGroups.SaveUserAssignment({
                UserID: savedUser.ID,
                UserGroupID: group.ID
              });
              //save group assignment
            }
            if (
              this.state.newSelected.indexOf(index) == -1 &&
              this.state.selected.includes(group.ID!)
            ) {
              AdminUserGroups.DeleteUserAssignment(group.ID!, savedUser.ID!);
              //delete group assignment
            }
          });
        }
        //redirect back to list
      })
      .catch(error => {
        console.log(error);
      });
  };

  public render() {
    const { classes, theme } = this.props;

    return this.state ? (
      <form
        name="PermissionGroupForm"
        className={classes.root}
        onSubmit={this.onSubmit}
      >
        {this.state.user ? (
          <Typography component="legend" variant="h5">{`${
            this.state.user.ID ? "Edit" : "New"
          } Internal User`}</Typography>
        ) : (
          <ContentLoading
            rows={1}
            height={theme.typography.h5.fontSize}
            width={250}
          />
        )}

        <Grid container spacing={16}>
          <Grid item sm={6} md={5}>
            {this.state.user ? (
              <React.Fragment>
                <TextField
                  fullWidth
                  margin="dense"
                  label="Username"
                  required
                  value={this.state.user.Username}
                  onChange={this.handleInputChange("Username")}
                  variant="outlined"
                  inputProps={{ maxLength: 10 }}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  required
                  label="First Name"
                  value={this.state.user.FirstName}
                  onChange={this.handleInputChange("FirstName")}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  margin="dense"
                  required
                  label="Last Name"
                  value={this.state.user.LastName}
                  onChange={this.handleInputChange("LastName")}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  margin="dense"
                  required
                  label="Email Address"
                  value={this.state.user.Email}
                  onChange={this.handleInputChange("Email")}
                  variant="outlined"
                />
                <OcPasswordField
                  required={!Boolean(this.state.user.ID)}
                  value={this.state.user.Password!}
                  onChange={this.handlePasswordChange}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={this.state.user.Active}
                      onChange={this.handleStatusChange}
                    />
                  }
                  label="Active"
                />
              </React.Fragment>
            ) : (
              <ContentLoading rows={5} />
            )}
          </Grid>
          <Grid item sm={6} md={7}>
            {this.state.user && this.state.stores && this.state.stores.Items ? (
              <TextField
                fullWidth
                variant="outlined"
                margin="dense"
                label="Store"
                select
                required
                value={this.state.user.xp.StoreAddressID}
                onChange={this.handleStoreChange}
              >
                {this.state.stores.Items.map(store => (
                  <MenuItem key={store.ID} value={store.ID}>
                    {store.CompanyName}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <ContentLoading rows={1} />
            )}
            {this.state.groups &&
            this.state.groups.Items &&
            this.state.selected ? (
              <FormControl margin="dense" fullWidth>
                <FormLabel style={{ marginBottom: theme.spacing.unit }}>
                  User Roles:
                </FormLabel>
                <Paper>
                  <EnhancedTable
                    selectable
                    selected={this.state.selected}
                    data={this.state.groups.Items}
                    columns={groupTableColumns}
                    onSelect={this.handleSelectionChange}
                  />
                </Paper>
              </FormControl>
            ) : (
              <ContentLoading rows={5} />
            )}
          </Grid>
        </Grid>
        <FormControl margin="normal" fullWidth className={classes.formButtons}>
          <ButtonLink
            type="button"
            size="large"
            color="default"
            variant="outlined"
            to="/admin/users"
          >
            Cancel
          </ButtonLink>
          <div className={classes.spacer} />
          <Button
            type="submit"
            size="large"
            color="secondary"
            variant="contained"
          >
            Save
          </Button>
        </FormControl>
      </form>
    ) : (
      <ContentLoading rows={6} />
    );
  }
}

export default withStyles(styles, { withTheme: true })(AdminUserForm);
