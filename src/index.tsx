import React from "react";
import { CookiesProvider } from "react-cookie";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { MuiThemeProvider } from "@material-ui/core";
import BachmansTheme from "./constants/theme.constants";
import AlertProvider from "./components/Alerts/AlertProvider";
import alertReducer from "./components/Alerts/redux/reducer";
import { createStore } from "redux";
import { Provider } from "react-redux";

const alertStore = createStore(alertReducer);

ReactDOM.render(
  <CookiesProvider>
    <MuiThemeProvider theme={BachmansTheme}>
      <Provider store={alertStore}>
        <AlertProvider>
          <App />
        </AlertProvider>
      </Provider>
    </MuiThemeProvider>
  </CookiesProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
