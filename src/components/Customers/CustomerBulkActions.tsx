import {
  createStyles,
  IconButton,
  Menu,
  MenuItem,
  Theme,
  withStyles
} from "@material-ui/core";
import { MoreHoriz } from "@material-ui/icons";
import { Users, User } from "ordercloud-javascript-sdk";
import React from "react";
import OcConfirmDialog from "../Shared/OcConfirmDialog";

const styles = (theme: Theme) =>
  createStyles({
    iconButton: {
      padding: 10
    }
  });

interface CustomerBulkActionsProps {
  classes: any;
  selected: number[];
  items?: User[];
  afterBulkAction: (
    type: "activate" | "deactivate" | "delete",
    count: number
  ) => void;
}

interface CustomerBulkActionsState {
  anchorEl: any;
  canDeactivate: User[];
  canActivateOrDelete: User[];
  isDesctructive?: boolean;
  confirmOpen: boolean;
  confirmType?: string;
  confirmMessage?: string;
  confirmText?: string;
  confirmCallback?: (event: React.MouseEvent) => void;
}

class CustomerBulkActions extends React.Component<
  CustomerBulkActionsProps,
  CustomerBulkActionsState
> {
  public state: CustomerBulkActionsState = {
    anchorEl: null,
    canDeactivate: new Array(),
    canActivateOrDelete: new Array(),
    confirmOpen: false
  };

  public componentDidMount = () => {
    this.determineAvailableActions();
  };

  public componentDidUpdate = (prevProps: CustomerBulkActionsProps) => {
    if (prevProps.selected !== this.props.selected) {
      this.determineAvailableActions();
    }
  };

  public determineAvailableActions() {
    const { selected, items } = this.props;
    let canDeactivate = new Array();
    let canActivateOrDelete = new Array();

    if (items) {
      selected.forEach(itemIndex => {
        if (items[itemIndex]) {
          if (items[itemIndex].Active) {
            canDeactivate.push(items[itemIndex]);
          } else {
            canActivateOrDelete.push(items[itemIndex]);
          }
        }
      });
    }

    this.setState({ canDeactivate, canActivateOrDelete });
  }

  public handleClick = (event: React.MouseEvent) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  public handleClose = () => {
    this.setState({ anchorEl: null });
  };

  public handleBulkDeactivate = (event: React.MouseEvent) => {
    const { canDeactivate } = this.state;
    this.setState({
      confirmOpen: true,
      confirmType: "Deactivate",
      confirmCallback: this.bulkStatusChange(false),
      confirmText: `Deactivate ${canDeactivate.length} customer${
        canDeactivate.length === 1 ? "" : "s"
      }`,
      confirmMessage: `Are you sure you want to deactivate ${
        canDeactivate.length
      } customer${
        canDeactivate.length === 1 ? "" : "s"
      }? They will no longer be able to access Storefront.`
    });
  };

  public handleBulkActivate = (event: React.MouseEvent) => {
    const { canActivateOrDelete } = this.state;
    this.setState({
      confirmOpen: true,
      confirmType: "Activate",
      confirmCallback: this.bulkStatusChange(true),
      confirmText: `Activate ${canActivateOrDelete.length} customer${
        canActivateOrDelete.length === 1 ? "" : "s"
      }`,
      confirmMessage: `Are you sure you want to activate ${
        canActivateOrDelete.length
      } customer${
        canActivateOrDelete.length === 1 ? "" : "s"
      }? They're access to Storefront will be restored.`
    });
  };

  public handleBulkDelete = (event: React.MouseEvent) => {
    const { canActivateOrDelete } = this.state;
    this.setState({
      confirmOpen: true,
      confirmType: "Delete",
      confirmCallback: this.bulkDelete,
      confirmText: `Delete ${canActivateOrDelete.length} customer${
        canActivateOrDelete.length === 1 ? "" : "s"
      }`,
      confirmMessage: `Are you sure you want to permanently delete ${
        canActivateOrDelete.length
      } customer${
        canActivateOrDelete.length === 1 ? "" : "s"
      }? This is a desctructive action and cannot be undone.`
    });
  };

  public bulkStatusChange = (newStatus: boolean) => (
    event: React.MouseEvent
  ) => {
    const { canDeactivate, canActivateOrDelete } = this.state;
    this.setState({ confirmOpen: false, anchorEl: null });

    const queue = new Array();
    const toBeChanged = newStatus ? canActivateOrDelete : canDeactivate;
    toBeChanged.forEach(user => {
      queue.push(Users.Patch("Bachmans", user.ID!, { Active: newStatus }));
    });

    Promise.all(queue).finally(() => {
      this.props.afterBulkAction(
        newStatus ? "activate" : "deactivate",
        toBeChanged.length
      );
    });
  };

  public bulkDelete = (event: React.MouseEvent) => {
    const { canActivateOrDelete } = this.state;
    this.setState({ confirmOpen: false, anchorEl: null });

    const queue = new Array();
    canActivateOrDelete.forEach(user => {
      queue.push(Users.Delete("Bachmans", user.ID!));
    });

    Promise.all(queue).finally(() => {
      this.props.afterBulkAction("delete", canActivateOrDelete.length);
    });
  };

  public handleConfirmCancel = (event: React.MouseEvent) => {
    this.setState({ confirmOpen: false, anchorEl: null });
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
            onClick={this.handleBulkActivate}
            disabled={!Boolean(this.state.canActivateOrDelete.length)}
          >
            Activate {`(${this.state.canActivateOrDelete.length})`}
          </MenuItem>
          <MenuItem
            onClick={this.handleBulkDeactivate}
            disabled={!Boolean(this.state.canDeactivate.length)}
          >
            Deactivate {`(${this.state.canDeactivate.length})`}
          </MenuItem>
          <MenuItem
            onClick={this.handleBulkDelete}
            disabled={!Boolean(this.state.canActivateOrDelete.length)}
          >
            Delete {`(${this.state.canActivateOrDelete.length})`}
          </MenuItem>
          <MenuItem onClick={this.handleClose}>Upload</MenuItem>
        </Menu>
        <OcConfirmDialog
          open={this.state.confirmOpen}
          title={`Bulk ${this.state.confirmType || "Action"}`}
          confirmText={this.state.confirmText}
          cancelText="Cancel"
          message={this.state.confirmMessage}
          onConfirm={this.state.confirmCallback}
          onCancel={this.handleConfirmCancel}
        />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(CustomerBulkActions);
