import {
  SHOW_ALERT,
  DISMISS_ALERT,
  ALERT_WARNING,
  ALERT_ERROR,
  ALERT_INFO,
  ALERT_SUCCESS
} from "./constants";

export type SHOW_ALERT = typeof SHOW_ALERT;
export type DISMISS_ALERT = typeof DISMISS_ALERT;
export type ALERT_WARNING = typeof ALERT_WARNING;
export type ALERT_ERROR = typeof ALERT_ERROR;
export type ALERT_INFO = typeof ALERT_INFO;
export type ALERT_SUCCESS = typeof ALERT_SUCCESS;
export type ALERT_VARIANTS =
  | ALERT_WARNING
  | ALERT_ERROR
  | ALERT_INFO
  | ALERT_SUCCESS;

export interface AlertShape {
  id: number;
  variant: ALERT_VARIANTS;
  message: string;
}

export interface ShowAlert {
  type: SHOW_ALERT;
  payload: AlertShape;
}

export interface DismissAlert {
  type: DISMISS_ALERT;
  payload: {
    id: number;
  };
}

export type AlertActions = ShowAlert | DismissAlert;

export interface AlertReducerShape {
  queue: AlertShape[];
}
