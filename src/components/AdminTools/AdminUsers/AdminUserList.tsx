import React from "react";
import { ListUser, User, AdminUsers, Address } from "ordercloud-javascript-sdk";
import EnhancedTable, {
  EnhancedTableColumn,
  EnhancedTableRowAction
} from "../../Layout/EnhancedTable";
import { Chip, Typography } from "@material-ui/core";
import { EditOutlined, VisibilityOutlined } from "@material-ui/icons";

const columnDefinition: EnhancedTableColumn[] = [
  {
    label: "User ID",
    value: "ID",
    sortable: true
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
    label: "Store",
    value: "xp.StoreAddressID"
  },
  {
    label: "Status",
    value: "Active",
    CellProps: {
      align: "center"
    }
  }
];

const rowActionsDefinition: EnhancedTableRowAction[] = [
  {
    title: "Edit User Info",
    icon: <EditOutlined />,
    link: (user: User) => {
      return `/admin/users/${user.ID}`;
    }
  }
];

export type AdminUserStatus = "active" | "inactive";

export interface AdminUserListOptions {
  search?: string;
  page?: string;
  sortBy?: string;
  pageSize?: string;
  status?: AdminUserStatus;
  role?: string;
  store?: string;
}

export interface AdminUserListProps {
  refresh: boolean;
  options: AdminUserListOptions;
  stores?: Address[];
  onChange?: (data: ListUser) => void;
  onSelect?: (selected: number[]) => void;
  onSort?: (newSort?: string) => void;
}

export interface AdminUserListState {
  data?: ListUser;
}

class AdminUserList extends React.Component<
  AdminUserListProps,
  AdminUserListState
> {
  public state: AdminUserListState = {
    data: undefined
  };

  public componentDidMount = () => {
    this.requestList();
  };

  public componentDidUpdate = (prevProps: AdminUserListProps) => {
    const { options, refresh } = this.props;
    if (
      Object.values(options).join("|") !==
        Object.values(prevProps.options).join("|") ||
      refresh !== prevProps.refresh
    ) {
      this.requestList();
    }
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
        <a target="_blank" href={`mailto:${value}`}>
          {value}
        </a>
      );
    }
    if (col.value === "xp.StoreAddressID") {
      if (this.props.stores) {
        const store = this.props.stores.filter(s => s.ID === value)[0];
        return store ? (
          store.CompanyName
        ) : (
          <Typography color="error" variant="overline" noWrap>
            Not Found
          </Typography>
        );
      }
    }
    return value;
  };

  public requestList = () => {
    const {
      search,
      page,
      pageSize,
      sortBy,
      store,
      status,
      role
    } = this.props.options;
    const filters: any = {};
    if (status) {
      filters["Active"] = Boolean(status === "active").toString();
    }
    if (store) {
      filters["xp.StoreAddressID"] = store;
    }
    this.setState({ data: undefined });

    AdminUsers.List({
      search,
      sortBy,
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 100,
      filters
    }).then(data => {
      this.setState({ data });
      if (this.props.onChange) {
        this.props.onChange(data);
      }
    });
  };

  public render() {
    const { onSelect, onSort, options } = this.props;
    const { data } = this.state;
    return (
      <EnhancedTable
        selectable
        data={data && data.Items}
        cellRenderer={this.renderCell}
        rowActions={rowActionsDefinition}
        columns={columnDefinition}
        sortBy={options.sortBy}
        onSelect={onSelect}
        onSort={onSort}
      />
    );
  }
}

export default AdminUserList;
