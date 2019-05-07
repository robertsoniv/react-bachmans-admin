import { withStyles, Theme, createStyles } from "@material-ui/core";
import {
  UserGroup,
  AdminUserGroups,
  ListUserGroup
} from "ordercloud-javascript-sdk";
import React from "react";
import { EditOutlined } from "@material-ui/icons";
import { OcMetaData } from "../../Shared/OcPagination";
import EnhancedTable, {
  EnhancedTableColumn,
  EnhancedTableRowAction
} from "../../Shared/EnhancedTable";

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

export interface AdminUserGroupListOptions {
  search?: string;
  page?: string;
  sortBy?: string;
  pageSize?: string;
}

interface AdminUserGroupListProps {
  refresh: boolean;
  onRowClick?: (userGroup: UserGroup) => void;
  onChange: (meta?: OcMetaData) => void;
  onSort: (newSort?: string) => void;
  classes: any;
  options: AdminUserGroupListOptions;
}

export const DEFAULT_OPTIONS: any = {
  pageSize: 100,
  filters: {
    "xp.IsPermissionGroup": true
  }
};

interface AdminUserGroupListState {
  data?: ListUserGroup;
}
class AdminUserGroupList extends React.Component<
  AdminUserGroupListProps,
  AdminUserGroupListState
> {
  public state: AdminUserGroupListState = {
    data: undefined
  };

  componentDidMount = () => {
    this.requestList();
  };

  componentDidUpdate = (prevProps: AdminUserGroupListProps) => {
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
    const { options, onRowClick } = this.props;
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
    const { onSort, options, onRowClick } = this.props;
    const { data } = this.state;
    return (
      <EnhancedTable
        data={data && data.Items}
        onRowClick={onRowClick}
        columns={columnDefinition}
        sortBy={options.sortBy}
        onSort={onSort}
      />
    );
  }
}

export default withStyles(styles)(AdminUserGroupList);
