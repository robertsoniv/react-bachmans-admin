import React from "react";
import {
  Theme,
  createStyles,
  withStyles,
  Toolbar,
  Paper,
  TextField,
  MenuItem
} from "@material-ui/core";

import { RouteComponentProps } from "react-router";
import { Meta, AdminUserGroups, UserGroup } from "ordercloud-javascript-sdk";
import SearchField from "../../SearchField/SearchField";
import InternalUserList from "./InternalUserList";
import ButtonLink from "../../Layout/ButtonLink";

interface InternalUserMangementProps extends RouteComponentProps {
  classes: any;
}

interface InternalUserMangementState {
  search: string;
  role: string;
  roles?: UserGroup[];
  meta?: Meta;
}

const styles = (theme: Theme) =>
  createStyles({
    toolbar: {
      marginTop: theme.spacing.unit * 2
    },
    tabs: {},
    paperHeader: {
      borderBottom: "1px solid " + theme.palette.grey[300],
      display: "flex",
      alignItems: "center"
    },
    meta: {
      marginRight: theme.spacing.unit * 3
    },
    paper: {
      margin: `${theme.spacing.unit * 1}px ${theme.spacing.unit * 3}px ${theme
        .spacing.unit * 3}px`
    },
    grow: {
      flexGrow: 1
    }
  });

class InternalUserMangement extends React.Component<
  InternalUserMangementProps,
  InternalUserMangementState
> {
  componentDidMount = () => {
    this.updateParamState();
    AdminUserGroups.List({
      pageSize: 100,
      filters: {
        "xp.IsPermissionGroup": "true"
      }
    }).then(roleList => {
      this.setState({ roles: roleList.Items });
    });
  };

  componentDidUpdate = (prevProps: InternalUserMangementProps) => {
    if (prevProps.location.search !== this.props.location.search) {
      this.updateParamState();
    }
  };

  public handleListUpdate = (meta?: Meta) => {
    this.setState({ meta });
  };

  public updateParamState = () => {
    const params = new URLSearchParams(this.props.location.search);
    const search: any = params.get("search");
    const role: any = params.get("role");
    this.setState({
      search,
      role
    });
  };

  public handleParamUpdate = (newParams: Object) => {
    const params = new URLSearchParams(this.props.location.search);
    Object.entries(newParams).forEach(([name, value]: [string, string]) => {
      value ? params.set(name, value) : params.delete(name);
    });
    this.props.history.push({
      ...this.props.location,
      search: params.toString()
    });
  };

  public handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    var params: any = { search: this.state.search };
    params.role = event.target.value;
    this.handleParamUpdate(params);
  };

  public render() {
    const { classes } = this.props;
    return this.state ? (
      <React.Fragment>
        <Toolbar className={classes.toolbar}>
          <SearchField
            placeholder="Search Internal Users..."
            onSearch={this.handleParamUpdate}
            value={this.state.search}
          />
          <TextField
            label="Filter by role"
            margin="none"
            select
            variant="outlined"
            InputLabelProps={{
              shrink: Boolean(this.state.role)
            }}
            onChange={this.handleRoleChange}
            value={this.state.role}
            style={{ width: 250 }}
          >
            <MenuItem value="">None</MenuItem>
            {this.state.roles &&
              this.state.roles.map(group => (
                <MenuItem key={group.ID} value={group.ID}>
                  {group.Name}
                </MenuItem>
              ))}
          </TextField>
          <div className={classes.grow} />
          <ButtonLink
            size="large"
            to="/admin/users/create"
            color="primary"
            variant="outlined"
          >
            New Internal User
          </ButtonLink>
        </Toolbar>
        <Paper className={classes.paper}>
          <InternalUserList
            onChange={this.handleListUpdate}
            search={this.state.search}
            userGroupID={this.state.role}
          />
        </Paper>
      </React.Fragment>
    ) : (
      ""
    );
  }
}

export default withStyles(styles)(InternalUserMangement);
