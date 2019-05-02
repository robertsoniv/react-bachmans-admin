import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@material-ui/core";
import classes from "*.module.scss";

interface OcConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: (event: React.MouseEvent) => void;
  onCancel?: (event: React.MouseEvent) => void;
}

class OcConfirmDialog extends React.Component<OcConfirmDialogProps> {
  public state = {
    open: this.props.open
  };

  public componentDidUpdate = (prevProps: OcConfirmDialogProps) => {
    if (
      prevProps.open !== this.props.open &&
      this.state.open !== this.props.open
    ) {
      this.setState({ open: this.props.open });
    }
  };

  public handleConfirm = (event: React.MouseEvent) => {
    const { onConfirm } = this.props;
    this.setState({ open: false });
    if (onConfirm) {
      onConfirm(event);
    }
  };

  public handleCancel = (event: React.MouseEvent) => {
    const { onCancel } = this.props;
    this.setState({ open: false });
    if (onCancel) {
      onCancel(event);
    }
  };

  public render() {
    const { title, message, confirmText, cancelText } = this.props;
    return (
      <Dialog
        open={this.state.open}
        aria-labelledby="oc-confirm-dialog-title"
        aria-describedby="oc-confirm-dialog-description"
      >
        <DialogTitle id="oc-confirm-dialog-title">
          {title || "Please confirm"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="oc-confirm-dialog-description">
            {message || "Are you sure?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel}>{cancelText || "No"}</Button>
          <Button
            onClick={this.handleConfirm}
            color="primary"
            variant="contained"
            autoFocus
          >
            {confirmText || "Yes"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default OcConfirmDialog;
