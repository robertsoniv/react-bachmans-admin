import { Reducer } from "redux";
import { AlertActions, AlertReducerShape } from "./types";
import {
  DEFAULT_ALERT_REDUCER_STATE,
  SHOW_ALERT,
  DISMISS_ALERT
} from "./constants";

const alertReducer: Reducer<AlertReducerShape, AlertActions> = (
  state: AlertReducerShape = DEFAULT_ALERT_REDUCER_STATE,
  action: AlertActions
) => {
  switch (action.type) {
    case SHOW_ALERT:
      return {
        queue: [...state.queue, action.payload]
      };
    case DISMISS_ALERT:
      return {
        queue: state.queue.filter(a => a.id !== action.payload.id)
      };
    default:
      return state;
  }
};

export default alertReducer;
