import React from "react";
import { Snackbar } from "@material-ui/core";
import Alert from "./Alert";

interface AlertProps {
  alerts: any[];
}

const Alerts: React.FunctionComponent<AlertProps> = (props: AlertProps) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={Boolean(props.alerts && props.alerts.length)}
    >
      {props.alerts.map(a => {
        <Alert {...a} />;
      })}
    </Snackbar>
  );
};
