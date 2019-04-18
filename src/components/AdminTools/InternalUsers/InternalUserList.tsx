import {
  Table,
  TableHead,
  withStyles,
  Theme,
  createStyles,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Badge,
  Chip
} from "@material-ui/core";
import { Meta, AdminUsers, User } from "ordercloud-javascript-sdk";
import React from "react";
import {
  Edit,
  CheckBoxRounded,
  CheckBoxOutlineBlankRounded
} from "@material-ui/icons";
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

const DEFAULT_OPTIONS: any = {
  sortBy: "!ID",
  pageSize: 100
};

interface InternalUserListProps {
  onChange: (meta?: Meta) => void;
  classes: any;
  search?: string;
  userGroupID?: string;
}

interface InternalUserListState {
  list?: User[];
  selected: string[];
  totalCount: number;
}

class InternalUserList extends React.Component<
  InternalUserListProps,
  InternalUserListState
> {
  componentDidMount = () => {
    this.retrieveList();
  };

  componentDidUpdate = (prev: InternalUserListProps) => {
    const { search } = this.props;
    if (search !== prev.search) {
      this.retrieveList();
    }
  };

  public retrieveList = () => {
    const { search, userGroupID } = this.props;
    this.setState({ list: undefined });
    AdminUsers.List({
      search,
      filters: {
        UserGroupID: userGroupID
      },
      ...DEFAULT_OPTIONS
    }).then(data => {
      this.setState({
        list: data.Items,
        selected: new Array(),
        totalCount: data.Meta!.TotalCount!
      });
      this.props.onChange(data.Meta);
    });
  };

  public isSelected = (id: string) => {
    return this.state.selected.includes(id);
  };

  public onSelectClick = (id: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = new Array();

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({ selected: newSelected });
  };

  public onSelectAllClick = () => {
    const { selected, list } = this.state;
    if (selected.length === list!.length) {
      this.setState({ selected: new Array() });
    } else {
      this.setState({ selected: list!.map(u => u.ID!) });
    }
  };

  public render() {
    if (this.state && this.state.list) {
      const { classes } = this.props;
      const { list, totalCount } = this.state;
      const selectedCount = this.state.selected.length;
      return (
        <div className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  {list && (
                    <Checkbox
                      color="primary"
                      indeterminate={
                        selectedCount > 0 && selectedCount < list.length
                      }
                      checked={selectedCount === list.length}
                      onChange={this.onSelectAllClick}
                    />
                  )}
                </TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {list &&
                list.map(user => {
                  const isSelected = this.isSelected(user.ID!);
                  return (
                    <TableRow key={user.ID}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isSelected}
                          onChange={this.onSelectClick(user.ID!)}
                        />
                      </TableCell>
                      <TableCell>{user.Username}</TableCell>
                      <TableCell>{`${user.FirstName} ${
                        user.LastName
                      }`}</TableCell>
                      <TableCell>{user.Email}</TableCell>
                      <TableCell align="center">
                        <Chip
                          variant="outlined"
                          color={user.Active ? "secondary" : "default"}
                          label={user.Active ? "Active" : "Inactive"}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButtonLink to={`/admin/users/${user.ID}`}>
                          <Edit fontSize="small" />
                        </IconButtonLink>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      );
    }
    return <ContentLoading type="table" rows={6} />;
  }
}

export default withStyles(styles)(InternalUserList);
