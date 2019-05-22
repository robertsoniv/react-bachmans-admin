import {
  AppBar,
  Chip,
  createStyles,
  Fade,
  Theme,
  Toolbar,
  withStyles
} from "@material-ui/core";
import { User, UserGroups, UserGroup } from "ordercloud-javascript-sdk";
import React from "react";
import { RouteComponentProps } from "react-router";
import ProtectedContent from "../Layout/ProtectedContent";
import OcPagination, { OcMetaData } from "../Shared/OcPagination";
import OcSearch from "../Shared/OcSearch";
import CustomerBulkActions from "./CustomerBulkActions";
import CustomerFilterPopover from "./CustomerFilterPopover";
import CustomerList, { CustomerListOptions } from "./CustomerList";
import { DateRangeChangeEvent } from "../Shared/OcDateRange/OcDateRange";

interface CustomerManagementProps extends RouteComponentProps {
  classes: any;
}

interface CustomerManagementState {
  meta?: OcMetaData;
  selected: number[];
  items?: User[];
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

class CustomerManagement extends React.Component<
  CustomerManagementProps,
  CustomerManagementState
> {
  public state: CustomerManagementState = {
    selected: new Array(),
    searchTerm: "",
    refresh: false
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

  public getOptions = (keys: string[]): CustomerListOptions => {
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

  public handleFilterChange = (n: any) => {
    const { location, history } = this.props;
    const params = new URLSearchParams(location.search);
    Object.entries(n).forEach(([key, value]: [string, any]) => {
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
    history.push(`/customers/${user.ID}`);
  };

  public render() {
    const { location, history, classes } = this.props;
    const search = new URLSearchParams(location.search).get("search") || "";
    const options = this.getOptions([
      "search",
      "page",
      "pageSize",
      "sortBy",
      "status",
      "login",
      "synced",
      "group",
      "ecn"
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
              placeholder="Search Customers..."
            />
            <div className={classes.spacer} />
            {this.state && (
              <CustomerFilterPopover
                onChange={this.handleFilterChange}
                options={options}
              />
            )}
            <ProtectedContent
              hasAccess={p => p.includes("feature-internal-user-bulk")}
            >
              <CustomerBulkActions
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
        <CustomerList
          refresh={this.state.refresh}
          options={options}
          onRowClick={this.handleRowClick}
          onSelect={this.handleSelectionChange}
          onChange={this.handleListChange}
          onSort={this.handleColumnSort}
        />
      </div>
    );
  }
}

export default withStyles(styles)(CustomerManagement);
