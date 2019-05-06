import { ALERT_VARIANTS } from "./types";

export const SHOW_ALERT = "SHOW_ALERT";
export const DISMISS_ALERT = "DISMISS_ALERT";
export const ALERT_WARNING = "warning";
export const ALERT_ERROR = "error";
export const ALERT_SUCCESS = "success";
export const ALERT_INFO = "info";
export const DEFAULT_ALERT_TIMEOUT = 3000;
export const DEFAULT_ALERT_REDUCER_STATE = {
  queue: []
};
