import React from "react";
import {
  Theme,
  createStyles,
  withStyles,
  Toolbar,
  AppBar
} from "@material-ui/core";

import { RouteComponentProps } from "react-router";
import AdminUserGroupList, {
  AdminUserGroupListOptions
} from "./AdminUserGroupList";
import OcSearch from "../../Shared/OcSearch";
import OcPagination, { OcMetaData } from "../../Shared/OcPagination";
import IconButtonLink from "../../Shared/IconButtonLink";
import { Add } from "@material-ui/icons";
import { UserGroup } from "ordercloud-javascript-sdk";
import ProtectedContent from "../../Layout/ProtectedContent";

interface AdminUserGroupMangementProps extends RouteComponentProps {
  classes: any;
}

interface AdminUserGroupMangementState {
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

class AdminUserGroupMangement extends React.Component<
  AdminUserGroupMangementProps,
  AdminUserGroupMangementState
> {
  public state: AdminUserGroupMangementState = {
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

  public getOptions = (keys: string[]): AdminUserGroupListOptions => {
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

  public handleRowClick = (userGroup: UserGroup) => {
    const { history } = this.props;
    history.push(`/admin/roles/${userGroup.ID}`);
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
            <ProtectedContent
              hasAccess={p => p.includes("feature-internal-user-admin")}
            >
              <React.Fragment>
                <div className={classes.spacer} />
                <IconButtonLink
                  title="Create User Role"
                  to="/admin/roles/create"
                  className={classes.iconButton}
                >
                  <Add />
                </IconButtonLink>
              </React.Fragment>
            </ProtectedContent>

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
        <AdminUserGroupList
          refresh={this.state.refresh}
          onRowClick={this.handleRowClick}
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

export default withStyles(styles)(AdminUserGroupMangement);
