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
import { UserGroup, Meta, AdminUserGroups } from "ordercloud-javascript-sdk";
import React from "react";
import { Edit } from "@material-ui/icons";
import IconButtonLink from "../../Layout/IconButtonLink";
import ContentLoading from "../../Layout/ContentLoading";

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

interface PermissionGroupListProps {
  onChange: (meta?: Meta) => void;
  classes: any;
  search?: string;
}

const DEFAULT_OPTIONS: any = {
  sortBy: "Name",
  pageSize: 100,
  filters: {
    "xp.IsPermissionGroup": true
  }
};

interface PermissionGroupListState {
  list?: UserGroup[];
}
class PermissionGroupList extends React.Component<
  PermissionGroupListProps,
  PermissionGroupListState
> {
  componentDidMount = () => {
    this.retrieveList();
  };

  componentDidUpdate = (prev: PermissionGroupListProps) => {
    const { search } = this.props;
    if (search !== prev.search) {
      this.retrieveList();
    }
  };

  public retrieveList = () => {
    const { search } = this.props;
    this.setState({ list: undefined });
    AdminUserGroups.List({
      search,
      ...DEFAULT_OPTIONS
    }).then(data => {
      this.setState({ list: data.Items });
      this.props.onChange(data.Meta);
    });
  };

  public render() {
    if (this.state && this.state.list) {
      const { classes } = this.props;
      const { list } = this.state;
      return (
        <div className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell colSpan={2}>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list &&
                list.map(userGroup => (
                  <TableRow key={userGroup.ID}>
                    <TableCell>{userGroup.Name}</TableCell>
                    <TableCell>{userGroup.Description}</TableCell>
                    <TableCell align="right">
                      <IconButtonLink to={`/admin/roles/${userGroup.ID}`}>
                        <Edit fontSize="small" />
                      </IconButtonLink>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      );
    }
    return <ContentLoading type="table" rows={6} />;
  }
}

export default withStyles(styles)(PermissionGroupList);
