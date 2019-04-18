import React from "react";
import {
  Theme,
  createStyles,
  withStyles,
  Toolbar,
  Paper
} from "@material-ui/core";

import { RouteComponentProps } from "react-router";
import { Meta } from "ordercloud-javascript-sdk";
import SearchField from "../../SearchField/SearchField";
import PermissionGroupList from "./PermissionGroupList";
import ButtonLink from "../../Layout/ButtonLink";

interface PermissionGroupMangementProps extends RouteComponentProps {
  classes: any;
}

interface PermissionGroupMangementState {
  search: string;
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

class PermissionGroupMangement extends React.Component<
  PermissionGroupMangementProps,
  PermissionGroupMangementState
> {
  componentDidMount = () => {
    this.updateParamState();
  };

  componentDidUpdate = (prevProps: PermissionGroupMangementProps) => {
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
    this.setState({
      search
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

  public render() {
    const { classes } = this.props;
    return this.state ? (
      <React.Fragment>
        <Toolbar className={classes.toolbar}>
          <SearchField
            placeholder="Search User Roles..."
            onSearch={this.handleParamUpdate}
            value={this.state.search}
          />
          <div className={classes.grow} />
          <ButtonLink
            size="large"
            to="/admin/roles/create"
            color="primary"
            variant="outlined"
          >
            New User Role
          </ButtonLink>
        </Toolbar>
        <Paper className={classes.paper}>
          <PermissionGroupList
            onChange={this.handleListUpdate}
            search={this.state.search}
          />
        </Paper>
      </React.Fragment>
    ) : (
      ""
    );
  }
}

export default withStyles(styles)(PermissionGroupMangement);
