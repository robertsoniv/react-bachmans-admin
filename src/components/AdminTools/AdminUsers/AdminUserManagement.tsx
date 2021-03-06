import {
  AppBar,
  Chip,
  createStyles,
  Fade,
  Theme,
  Toolbar,
  withStyles
} from "@material-ui/core";
import { PersonAdd } from "@material-ui/icons";
import { Address, AdminAddresses, User } from "ordercloud-javascript-sdk";
import React from "react";
import { RouteComponentProps } from "react-router";
import ProtectedContent from "../../Layout/ProtectedContent";
import IconButtonLink from "../../Shared/IconButtonLink";
import OcPagination, { OcMetaData } from "../../Shared/OcPagination";
import OcSearch from "../../Shared/OcSearch";
import AdminUserBulkActions from "./AdminUserBulkActions";
import AdminUserFilterPopover from "./AdminUserFilterPopover";
import AdminUserList, { AdminUserListOptions } from "./AdminUserList";

interface AdminUserManagementProps extends RouteComponentProps {
  classes: any;
}

interface AdminUserManagementState {
  meta?: OcMetaData;
  selected: number[];
  items?: User[];
  stores?: Address[];
  searchTerm: string;
  refresh: boolean;
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

class AdminUserManagement extends React.Component<
  AdminUserManagementProps,
  AdminUserManagementState
> {
  public state: AdminUserManagementState = {
    selected: new Array(),
    searchTerm: "",
    refresh: false
  };

  public componentDidMount = () => {
    AdminAddresses.List({ pageSize: 100, filters: { ID: "Store-*" } }).then(
      storeList => {
        this.setState({ stores: storeList.Items });
      }
    );
  };

  public handleListChange = (data: any) => {
    this.setState({ meta: data.Meta, items: data.Items });
  };

  public handleSelectionChange = (selected: number[]) => {
    this.setState({ selected });
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

  public getOptions = (keys: string[]): AdminUserListOptions => {
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

  public handleFilterChange = (n: {
    status: string;
    store: string;
    role: string;
  }) => {
    const { location, history } = this.props;
    const params = new URLSearchParams(location.search);
    Object.entries(n).forEach(([key, value]: [string, string]) => {
      if (value.length) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.delete("page");
    history.push({
      ...location,
      search: params.toString()
    });
  };

  public afterBulkAction = () => {
    this.setState(state => ({ refresh: !state.refresh }));
  };

  public handleRowClick = (user: User) => {
    const { history } = this.props;
    history.push(`/admin/users/${user.ID}`);
  };

  public render() {
    const { location, history, classes } = this.props;
    const search = new URLSearchParams(location.search).get("search") || "";
    const { stores } = this.state;
    const options = this.getOptions([
      "search",
      "page",
      "pageSize",
      "sortBy",
      "status",
      "store",
      "role"
    ]);
    return (
      <div className={classes.root}>
        <AppBar
          color="default"
          position="sticky"
          className={classes.appBar}
          elevation={0}
        >
          <Toolbar>
            <OcSearch
              onChange={this.handleSearchChange}
              value={search}
              placeholder="Search Internal Users..."
            />
            <div className={classes.spacer} />
            {this.state && this.state.stores && (
              <AdminUserFilterPopover
                stores={this.state.stores}
                onChange={this.handleFilterChange}
                options={options}
              />
            )}
            <ProtectedContent
              hasAccess={p => p.includes("feature-internal-user-admin")}
            >
              <IconButtonLink
                title="Create User"
                to="/admin/users/create"
                className={classes.iconButton}
              >
                <PersonAdd />
              </IconButtonLink>
            </ProtectedContent>
            <ProtectedContent
              hasAccess={p => p.includes("feature-internal-user-bulk")}
            >
              <AdminUserBulkActions
                afterBulkAction={this.afterBulkAction}
                selected={this.state.selected}
                items={this.state.items}
              />
            </ProtectedContent>
            <div className={classes.grow} />
            <Fade in={this.state.selected.length > 0}>
              <Chip
                color="primary"
                label={`${this.state.selected.length} Selected`}
              />
            </Fade>
            <div className={classes.spacer} />
            {this.state && this.state.meta && (
              <OcPagination
                meta={this.state.meta}
                location={location}
                history={history}
              />
            )}
          </Toolbar>
        </AppBar>
        <AdminUserList
          refresh={this.state.refresh}
          options={options}
          stores={stores}
          onRowClick={this.handleRowClick}
          onSelect={this.handleSelectionChange}
          onChange={this.handleListChange}
          onSort={this.handleColumnSort}
        />
      </div>
    );
  }
}

export default withStyles(styles)(AdminUserManagement);
