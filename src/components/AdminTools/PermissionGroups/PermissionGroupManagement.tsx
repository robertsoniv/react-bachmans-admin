import React from "react";
import {
  Theme,
  createStyles,
  withStyles,
  Toolbar,
  Paper,
  AppBar
} from "@material-ui/core";

import { RouteComponentProps } from "react-router";
import PermissionGroupList, {
  PermissionGroupListOptions
} from "./PermissionGroupList";
import OcSearch from "../../Shared/OcSearch";
import OcPagination, { OcMetaData } from "../../Shared/OcPagination";
import IconButtonLink from "../../Layout/IconButtonLink";
import { Add } from "@material-ui/icons";

interface PermissionGroupMangementProps extends RouteComponentProps {
  classes: any;
}

interface PermissionGroupMangementState {
  refresh: boolean;
  meta?: OcMetaData;
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

class PermissionGroupMangement extends React.Component<
  PermissionGroupMangementProps,
  PermissionGroupMangementState
> {
  public state: PermissionGroupMangementState = {
    refresh: false
  };

  public handleListUpdate = (meta?: OcMetaData) => {
    this.setState({ meta });
  };

  public handleSearchChange = (searchTerm: string) => {
    const { location, history } = this.props;
    const params = new URLSearchParams(location.search);
    if (searchTerm && searchTerm.length) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    params.delete("page");
    history.push({
      ...location,
      search: params.toString()
    });
  };

  public handleColumnSort = (newSort?: string) => {
    const { location, history } = this.props;
    const params = new URLSearchParams(location.search);
    if (newSort) {
      params.set("sortBy", newSort);
    } else {
      params.delete("sortBy");
    }
    params.delete("page");
    history.push({
      ...location,
      search: params.toString()
    });
  };

  public getOptions = (keys: string[]): PermissionGroupListOptions => {
    const { search } = this.props.location;
    const params = new URLSearchParams(search);
    var options: any = {};
    params.forEach((val, key) => {
      if (keys.includes(key)) {
        options[key] = val;
      }
    });
    return options;
  };

  public render() {
    const { classes, location, history } = this.props;
    const options = this.getOptions(["search", "page", "pageSize", "sortBy"]);
    return this.state ? (
      <div className={classes.root}>
        <AppBar
          color="default"
          position="sticky"
          className={classes.appBar}
          elevation={0}
        >
          <Toolbar>
            <OcSearch
              placeholder="Search User Roles..."
              onChange={this.handleSearchChange}
              value={options.search || ""}
            />
            <div className={classes.spacer} />
            <IconButtonLink
              title="Create User Role"
              to="/admin/roles/create"
              className={classes.iconButton}
            >
              <Add />
            </IconButtonLink>

            <div className={classes.grow} />
            {this.state && this.state.meta && (
              <OcPagination
                meta={this.state.meta}
                location={location}
                history={history}
              />
            )}
          </Toolbar>
        </AppBar>
        <PermissionGroupList
          refresh={this.state.refresh}
          onSort={this.handleColumnSort}
          onChange={this.handleListUpdate}
          options={options}
        />
      </div>
    ) : (
      ""
    );
  }
}

export default withStyles(styles)(PermissionGroupMangement);
