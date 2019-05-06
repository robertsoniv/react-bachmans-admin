import { ShowAlert, ALERT_VARIANTS, DismissAlert } from "./types";
import {
  SHOW_ALERT,
  DEFAULT_ALERT_TIMEOUT,
  DISMISS_ALERT,
  ALERT_ERROR,
  ALERT_WARNING,
  ALERT_INFO,
  ALERT_SUCCESS
} from "./constants";

export function showAlert(variant: ALERT_VARIANTS, message: string): ShowAlert {
  return {
    type: SHOW_ALERT,
    payload: {
      id: new Date().getTime(),
      message,
      variant
    }
  };
}

export function dismissAlert(id: number): DismissAlert {
  return {
    type: DISMISS_ALERT,
    payload: {
      id
    }
  };
}

export function warning(message: string) {
  return showAlert(ALERT_WARNING, message);
}
export function error(message: string) {
  return showAlert(ALERT_ERROR, message);
}
export function success(message: string) {
  return showAlert(ALERT_SUCCESS, message);
}
export function info(message: string) {
  return showAlert(ALERT_INFO, message);
}

export default {
  error,
  warning,
  success,
  info
};
