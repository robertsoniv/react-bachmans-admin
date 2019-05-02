import {
  Table,
  TableHead,
  withStyles,
  Theme,
  createStyles,
  TableRow,
  TableCell,
  TableBody
} from "@material-ui/core";
import {
  UserGroup,
  Meta,
  AdminUserGroups,
  ListUserGroup
} from "ordercloud-javascript-sdk";
import React from "react";
import { Edit, EditOutlined } from "@material-ui/icons";
import IconButtonLink from "../../Layout/IconButtonLink";
import ContentLoading from "../../Layout/ContentLoading";
import { OcMetaData } from "../../Shared/OcPagination";
import EnhancedTable, {
  EnhancedTableColumn,
  EnhancedTableRowAction
} from "../../Layout/EnhancedTable";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      overflowX: "auto"
    },
    metaData: {
      marginTop: theme.spacing.unit,
      marginLeft: theme.spacing.unit * 3,
      marginRight: theme.spacing.unit * 3
    }
  });

const columnDefinition: EnhancedTableColumn[] = [
  {
    label: "Role ID",
    value: "ID",
    sortable: true
  },
  {
    label: "Name",
    value: "Name",
    sortable: true
  },
  {
    label: "Description",
    value: "Description"
  }
];

const rowActionsDefinition: EnhancedTableRowAction[] = [
  {
    title: "Edit User Role",
    icon: <EditOutlined />,
    link: (group: UserGroup) => {
      return `/admin/roles/${group.ID}`;
    }
  }
];

export interface PermissionGroupListOptions {
  search?: string;
  page?: string;
  sortBy?: string;
  pageSize?: string;
}

interface PermissionGroupListProps {
  refresh: boolean;
  onChange: (meta?: OcMetaData) => void;
  onSort: (newSort?: string) => void;
  classes: any;
  options: PermissionGroupListOptions;
}

export const DEFAULT_OPTIONS: any = {
  pageSize: 100,
  filters: {
    "xp.IsPermissionGroup": true
  }
};

interface PermissionGroupListState {
  data?: ListUserGroup;
}
class PermissionGroupList extends React.Component<
  PermissionGroupListProps,
  PermissionGroupListState
> {
  public state: PermissionGroupListState = {
    data: undefined
  };

  componentDidMount = () => {
    this.requestList();
  };

  componentDidUpdate = (prevProps: PermissionGroupListProps) => {
    const { options, refresh } = this.props;
    if (
      Object.values(options).join("|") !==
        Object.values(prevProps.options).join("|") ||
      refresh !== prevProps.refresh
    ) {
      this.requestList();
    }
  };

  public requestList = () => {
    const { options } = this.props;
    this.setState({ data: undefined });
    AdminUserGroups.List({
      ...options,
      ...DEFAULT_OPTIONS
    }).then(data => {
      this.setState({ data });
      this.props.onChange(data.Meta as OcMetaData);
    });
  };

  public render() {
    const { onSort, options } = this.props;
    const { data } = this.state;
    return (
      <EnhancedTable
        data={data && data.Items}
        rowActions={rowActionsDefinition}
        columns={columnDefinition}
        sortBy={options.sortBy}
        onSort={onSort}
      />
    );
  }
}

export default withStyles(styles)(PermissionGroupList);
