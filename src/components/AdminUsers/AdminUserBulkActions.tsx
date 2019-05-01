import React from "react";
import {
  withStyles,
  Theme,
  createStyles,
  IconButton,
  Menu,
  MenuItem,
  Tooltip
} from "@material-ui/core";
import { MoreHoriz } from "@material-ui/icons";
import { User } from "ordercloud-javascript-sdk";

const styles = (theme: Theme) =>
  createStyles({
    iconButton: {
      padding: 10
    }
  });

interface AdminUserBulkActionsProps {
  classes: any;
  selected: number[];
  items?: User[];
}

class AdminUserBulkActions extends React.Component<AdminUserBulkActionsProps> {
  public state = {
    anchorEl: null,
    canDeactivate: 0,
    canActivate: 0,
    canDelete: 0
  };

  public componentDidMount = () => {
    this.determineAvailableActions();
  };

  public componentDidUpdate = (prevProps: AdminUserBulkActionsProps) => {
    if (prevProps.selected !== this.props.selected) {
      this.determineAvailableActions();
    }
  };

  public determineAvailableActions() {
    const { selected, items } = this.props;
    let canActivate = 0;
    let canDeactivate = 0;
    let canDelete = 0;

    if (items) {
      selected.forEach(itemIndex => {
        if (items[itemIndex]) {
          if (items[itemIndex].Active) {
            canDeactivate++;
          } else {
            canActivate++;
            canDelete++;
          }
        }
      });
    }

    this.setState({ canActivate, canDeactivate, canDelete });
  }

  public handleClick = (event: React.MouseEvent) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  public handleClose = () => {
    this.setState({ anchorEl: null });
  };

  public render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    return (
      <React.Fragment>
        <IconButton
          title="Bulk Actions"
          aria-owns={anchorEl ? "bulkMenu" : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
          className={classes.iconButton}
        >
          <MoreHoriz />
        </IconButton>
        <Menu
          id="bulkMenu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem
            onClick={this.handleClose}
            disabled={!Boolean(this.state.canActivate)}
          >
            Activate {`(${this.state.canActivate})`}
          </MenuItem>
          <MenuItem
            onClick={this.handleClose}
            disabled={!Boolean(this.state.canDeactivate)}
          >
            Deactivate {`(${this.state.canDeactivate})`}
          </MenuItem>
          <MenuItem
            onClick={this.handleClose}
            disabled={!Boolean(this.state.canDelete)}
          >
            Delete {`(${this.state.canDelete})`}
          </MenuItem>
          <MenuItem onClick={this.handleClose}>Upload</MenuItem>
        </Menu>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(AdminUserBulkActions);
