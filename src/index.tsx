import React from "react";
import { CookiesProvider } from "react-cookie";
import ReactDOM from "react-dom";
import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { MuiThemeProvider } from "@material-ui/core";
import BachmansTheme from "./constants/theme.constants";
import { AppContext } from "./App.context";

// import rootReducer from "./reducers";

const middlewares: any[] = [];
const logger = createLogger({});
middlewares.push(thunk);

if (process.env.NODE_ENV === "development") {
  middlewares.push(logger);
}

// const store = createStore(rootReducer, applyMiddleware(...middlewares));

ReactDOM.render(
  <CookiesProvider>
    <MuiThemeProvider theme={BachmansTheme}>
      <App />
    </MuiThemeProvider>
  </CookiesProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
