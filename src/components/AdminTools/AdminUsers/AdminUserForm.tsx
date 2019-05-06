import React from "react";
import {
  Theme,
  createStyles,
  withStyles,
  TextField,
  Grid,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Paper,
  FormLabel,
  FormControl,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography
} from "@material-ui/core";
import {
  AdminUsers,
  AdminUserGroups,
  User,
  ListUserGroup,
  ListUserGroupAssignment,
  AdminAddresses,
  ListAddress,
  UserGroup
} from "ordercloud-javascript-sdk";
import { DEFAULT_OPTIONS } from "../PermissionGroups/PermissionGroupList";
import ContentLoading from "../../Layout/ContentLoading";
import OcPasswordField from "../../Shared/OcPasswordField";
import { ErrorSharp } from "@material-ui/icons";

interface AdminUserFormProps {
  user: User;
  assignments?: ListUserGroupAssignment;
  disabled?: boolean;
  onSubmit: (updatedUser: User, selectedRoles: string[]) => Promise<any>;
  classes: any;
  theme: Theme;
}

interface AdminUserFormState {
  user: User;
  groups: ListUserGroup;
  assignments: ListUserGroupAssignment;
  selectedRoles: string[];
  newSelected: number[];
  errors: string[];
  stores: ListAddress;
  passwordConfirmation: string;
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing.unit * 3
    },
    formButtons: {
      display: "flex",
      flexFlow: "row nowrap"
    },
    grow: {
      flexGrow: 1
    },
    spacer: {
      width: theme.spacing.unit
    },
    userRoles: {
      border: `1px solid ${theme.palette.divider}`
    }
  });

class AdminUserForm extends React.Component<
  AdminUserFormProps,
  AdminUserFormState
> {
  public componentDidMount = () => {
    this.setInitialState();

    AdminUserGroups.List(DEFAULT_OPTIONS).then(groups => {
      this.setState({ groups });
    });

    AdminAddresses.List({ pageSize: 100, filters: { ID: "Store-*" } }).then(
      stores => {
        this.setState({ stores });
      }
    );
  };

  public componentDidUpdate = (prevProps: AdminUserFormProps) => {
    if (this.props.disabled && this.props.disabled !== prevProps.disabled) {
      this.setInitialState();
    }
  };

  public setInitialState = () => {
    const { user, assignments } = this.props;
    this.setState({
      passwordConfirmation: "",
      errors: new Array(),
      user,
      selectedRoles: assignments
        ? assignments.Items!.map(a => a.UserGroupID!)
        : new Array()
    });
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
        errors: state.errors.filter(
          e => key !== "Username" && e !== "User.UsernameMustBeUnique"
        ),
        user: {
          ...state.user,
          [key]: value
        }
      };
    });
  };

  public onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (this.props.onSubmit) {
      this.props
        .onSubmit(this.state.user, this.state.selectedRoles)
        .catch(this.handleError);
    }
  };

  public handleError = (error: any) => {
    if (
      error &&
      error.response &&
      error.response.body &&
      error.response.body.Errors &&
      error.response.body.Errors.length
    ) {
      this.setState({
        errors: error.response.body.Errors.map((e: any) => e.ErrorCode)
      });
    }
  };

  public handleRoleToggle = (roleID: string) => (event: React.MouseEvent) => {
    const { selectedRoles } = this.state;
    if (selectedRoles.includes(roleID)) {
      this.setState({
        selectedRoles: selectedRoles.filter(id => id !== roleID)
      });
    } else {
      this.setState({ selectedRoles: [...selectedRoles, roleID] });
    }
  };

  public render() {
    const { classes, theme, disabled } = this.props;

    return this.state ? (
      <form
        name="AdminUserForm"
        className={classes.root}
        onSubmit={this.onSubmit}
      >
        <Grid container spacing={16}>
          <Grid item md={5}>
            {this.state.user ? (
              <React.Fragment>
                <TextField
                  fullWidth
                  margin="dense"
                  label="Username"
                  required
                  value={this.state.user.Username}
                  onChange={this.handleInputChange("Username")}
                  InputProps={{ readOnly: disabled }}
                  helperText={
                    this.state.errors &&
                    this.state.errors.includes("User.UsernameMustBeUnique") && (
                      <Typography variant="inherit" color="error">
                        This Username is already in use by another Internal
                        User.
                      </Typography>
                    )
                  }
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
                  InputProps={{ readOnly: disabled }}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  margin="dense"
                  required
                  label="Last Name"
                  value={this.state.user.LastName}
                  onChange={this.handleInputChange("LastName")}
                  InputProps={{ readOnly: disabled }}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  margin="dense"
                  required
                  label="Email Address"
                  value={this.state.user.Email}
                  onChange={this.handleInputChange("Email")}
                  InputProps={{ readOnly: disabled }}
                  variant="outlined"
                />
                {this.state.stores && this.state.stores.Items ? (
                  <TextField
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    label="Store"
                    select
                    required
                    value={this.state.user.xp.StoreAddressID}
                    InputProps={{ readOnly: disabled }}
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
                {!disabled && (
                  <OcPasswordField
                    required={!Boolean(this.state.user.ID)}
                    value={this.state.user.Password!}
                    onChange={this.handlePasswordChange}
                  />
                )}
                <FormControlLabel
                  disabled={disabled}
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
          <Grid item md={7}>
            {this.state.groups &&
            this.state.groups.Items &&
            this.state.selectedRoles ? (
              <FormControl margin="dense" fullWidth>
                <FormLabel style={{ marginBottom: theme.spacing.unit }}>
                  User Roles:
                </FormLabel>
                <Paper elevation={0} className={classes.userRoles}>
                  <List>
                    {this.state.groups.Items.map(g => (
                      <ListItem
                        disabled={disabled}
                        key={g.ID}
                        dense
                        button
                        onClick={this.handleRoleToggle(g.ID!)}
                      >
                        <Checkbox
                          readOnly={disabled}
                          color="primary"
                          checked={this.state.selectedRoles.includes(g.ID!)}
                          tabIndex={-1}
                          disableRipple
                        />
                        <ListItemText
                          primary={g.Name}
                          secondary={g.Description}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </FormControl>
            ) : (
              <ContentLoading rows={5} />
            )}
          </Grid>
        </Grid>
        {!disabled && (
          <FormControl
            margin="normal"
            fullWidth
            className={classes.formButtons}
          >
            <Button
              type="submit"
              size="large"
              color="secondary"
              variant="contained"
            >
              Save Changes
            </Button>
          </FormControl>
        )}
      </form>
    ) : (
      <ContentLoading rows={6} />
    );
  }
}

export default withStyles(styles, { withTheme: true })(AdminUserForm);
