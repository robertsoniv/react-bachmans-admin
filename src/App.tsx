import {
  createStyles,
  CssBaseline,
  Theme,
  Typography,
  withStyles
} from "@material-ui/core";
import React from "react";
import { ReactCookieProps, withCookies } from "react-cookie";
import { BrowserRouter as Router } from "react-router-dom";
import { AppContext, AppContextShape } from "./App.context";
import AppHeader from "./components/Layout/AppHeader";
import LeftDrawer from "./components/Layout/LeftDrawer";
import MainContent from "./components/Layout/MainContent";
import Login from "./components/Login/Login";
import { client_id, scope } from "./constants/app.constants";
import OrderCloud from "ordercloud-javascript-sdk";
import jwtDecode from "jwt-decode";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      height: "100vh",
      width: "100vw",
      overflowX: "hidden",
      display: "flex"
    }
  });

interface AppProps extends ReactCookieProps {
  classes: any;
}

interface AppState {
  mobileOpen: boolean;
  context: AppContextShape;
}

function isTokenValid(token?: string): boolean {
  if (!token) {
    return false;
  }
  let decodedToken: any;
  try {
    decodedToken = jwtDecode(token);
  } catch (e) {
    return false;
  }
  const expirationSeconds = decodedToken.exp;
  const expirationWithPadding = expirationSeconds - 30; // accounts for time during transmission
  const currentSeconds = Date.now() / 1000;
  return expirationWithPadding > currentSeconds;
}

class App extends React.Component<AppProps, AppState> {
  componentDidMount = () => {
    const { cookies } = this.props;
    if (cookies && isTokenValid(cookies.get("token"))) {
      this.intializeOrderCloud(cookies.get("token"));
    } else {
      this.setInitialState();
    }
  };

  handleDrawerToggle = () => {
    this.setState(state => {
      !state.mobileOpen;
    });
  };

  handleLogin = (auth: OrderCloud.AccessToken) => {
    if (auth.access_token) {
      const { cookies } = this.props;
      if (cookies) {
        cookies.set("token", auth.access_token);
      }
      this.intializeOrderCloud(auth.access_token);
    }
  };

  setInitialState = () => {
    this.setState({ mobileOpen: false, context: {} });
  };

  intializeOrderCloud = async (token: string) => {
    this.setState({
      context: {
        token: token
      }
    });
    OrderCloud.Sdk.instance.authentications["oauth2"].accessToken = token;
    try {
      const user = await OrderCloud.Me.Get();
      const listUserGroups = await OrderCloud.Me.ListUserGroups({
        pageSize: 100
      });
      this.setState(state => {
        return {
          ...state,
          context: {
            token,
            user,
            groups: listUserGroups.Items
          }
        };
      });
    } catch (e) {
      this.setInitialState();
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <Router>
          {this.state ? (
            this.state.context &&
            OrderCloud.Sdk.instance.authentications["oauth2"].accessToken ? (
              <AppContext.Provider value={this.state.context}>
                <AppHeader onDrawerToggle={this.handleDrawerToggle} />
                <LeftDrawer
                  mobileOpen={this.state.mobileOpen}
                  onToggle={this.handleDrawerToggle}
                />
                <MainContent />
              </AppContext.Provider>
            ) : (
              <Login
                onSubmit={this.handleLogin}
                clientId={client_id}
                scope={scope}
              />
            )
          ) : (
            <Typography variant="h1">Loading</Typography>
          )}
        </Router>
      </div>
    );
  }
}

export default withCookies(withStyles(styles)(App));
