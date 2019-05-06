import React from "react";
import { Snackbar } from "@material-ui/core";
import { AlertShape, AlertReducerShape } from "./redux/types";
import Alert from "./Alert";
import { connect } from "react-redux";
import { dismissAlert } from "./redux/actions";

interface AlertProviderProps {
  alert?: AlertShape;
  dismiss: (id: number) => void;
}

class AlertProvider extends React.PureComponent<AlertProviderProps> {
  public handleClose = (id: number) => (event: any) => {
    this.props.dismiss(id);
  };

  public componentDidUpdate = (prevProps: AlertProviderProps) => {};

  public render() {
    const { children, alert } = this.props;
    return (
      <React.Fragment>
        {children}
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={Boolean(alert)}
          autoHideDuration={3000}
          onClose={alert && this.handleClose(alert.id)}
        >
          {alert && (
            <Alert
              variant={alert.variant}
              message={alert.message}
              onClose={this.handleClose(alert.id)}
            />
          )}
        </Snackbar>
      </React.Fragment>
    );
  }
}

export default connect(
  (state: AlertReducerShape) => ({
    alert: state.queue[0]
  }),
  dispatch => ({
    dismiss: (id: number) => dispatch(dismissAlert(id))
  })
)(AlertProvider);
