import { Chip } from "@material-ui/core";
import { Users, ListUser, User } from "ordercloud-javascript-sdk";
import React from "react";
import { AppContext } from "../../App.context";
import EnhancedTable, { EnhancedTableColumn } from "../Shared/EnhancedTable";

const columnDefinition: EnhancedTableColumn[] = [
  {
    label: "OMS Account Number",
    value: "ID",
    sortable: true
  },
  {
    label: "Eagle Customer Number",
    value: "xp.EagleCustomerNumber"
  },
  {
    label: "First Name",
    value: "FirstName",
    sortable: true
  },
  {
    label: "Last Name",
    value: "LastName",
    sortable: true
  },
  {
    label: "Email Address",
    value: "Email",
    sortable: true
  },
  {
    label: "Telephone",
    value: "Phone"
  },
  {
    label: "Status",
    value: "Active",
    CellProps: {
      align: "center"
    }
  }
];

export type CustomerStatus = "active" | "inactive";

export interface CustomerListOptions {
  search?: string;
  page?: string;
  sortBy?: string;
  pageSize?: string;
  status?: CustomerStatus;
  login?: string;
  synced?: string;
  ecn?: string;
  group?: string;
}

export interface CustomerListProps {
  refresh: boolean;
  options: CustomerListOptions;
  onRowClick?: (user: User) => void;
  onChange?: (data: ListUser) => void;
  onSelect?: (selected: number[]) => void;
  onSort?: (newSort?: string) => void;
}

export interface CustomerListState {
  data?: ListUser;
}

class CustomerList extends React.Component<
  CustomerListProps,
  CustomerListState
> {
  public state: CustomerListState = {
    data: undefined
  };

  public componentDidMount = () => {
    this.requestList();
  };

  public componentDidUpdate = (prevProps: CustomerListProps) => {
    const { options, refresh } = this.props;
    if (
      Object.values(options).join("|") !==
        Object.values(prevProps.options).join("|") ||
      refresh !== prevProps.refresh
    ) {
      this.requestList();
    }
  };

  public innerLinkClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  public renderCell = (row: User, col: EnhancedTableColumn, value: any) => {
    if (col.value === "Active") {
      return (
        <Chip
          variant="outlined"
          color={value ? "secondary" : "default"}
          label={value ? "Active" : "Inactive"}
        />
      );
    }
    if (col.value === "Email") {
      return (
        <a
          target="_blank"
          onClick={this.innerLinkClick}
          href={`mailto:${value}`}
        >
          {value}
        </a>
      );
    }
    if (col.value === "Phone") {
      return (
        <a target="_blank" onClick={this.innerLinkClick} href={`tel:${value}`}>
          {value}
        </a>
      );
    }
    return value;
  };

  public requestList = () => {
    const {
      search,
      page,
      pageSize,
      sortBy,
      status,
      login,
      synced,
      ecn,
      group
    } = this.props.options;
    const filters: any = {};
    if (status) {
      filters["Active"] = Boolean(status === "active").toString();
    }
    if (login) {
      filters["xp.LastLoginTimeStamp"] = `<=${login}|!*`;
    }
    if (synced) {
      filters["xp.EagleToFour51CustomerUpdateTimeStamp"] = `<=${synced}|!*`;
    }
    if (ecn) {
      filters["xp.EagleCustomerNumber"] = ecn;
    }
    this.setState({ data: undefined });
    Users.List("Bachmans", {
      search,
      sortBy,
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 100,
      filters,
      userGroupID: group
    }).then(data => {
      if (
        data &&
        data.Items &&
        data.Items.length === 1 &&
        this.props.onRowClick
      ) {
        this.props.onRowClick(data.Items[0]);
      } else {
        this.setState({ data });
        if (this.props.onChange) {
          this.props.onChange(data);
        }
      }
    });
  };

  public render() {
    const { onSelect, onSort, options, onRowClick } = this.props;
    const { data } = this.state;
    return (
      <AppContext.Consumer>
        {context => (
          <EnhancedTable
            selectable={Boolean(
              context &&
                context.permissions &&
                context.permissions.includes("feature-internal-user-bulk") &&
                context.permissions.includes("feature-internal-user-admin")
            )}
            data={data && data.Items}
            cellRenderer={this.renderCell}
            onRowClick={onRowClick}
            columns={columnDefinition}
            sortBy={options.sortBy}
            onSelect={onSelect}
            onSort={onSort}
          />
        )}
      </AppContext.Consumer>
    );
  }
}

export default CustomerList;
