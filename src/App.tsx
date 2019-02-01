import {
  createStyles,
  CssBaseline,
  Theme,
  withStyles,
  Typography
} from "@material-ui/core";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AppContext, AppContextShape } from "./App.context";
import LeftDrawer from "./components/Layout/LeftDrawer";
import AppHeader from "./components/Layout/AppHeader";
import MainContent from "./components/Layout/MainContent";
import Login, { LoginState } from "./components/Login/Login";
import { withCookies, ReactCookieProps } from "react-cookie";
import { client_id, scope } from "./constants/app.constants";
import OrderCloud from "ordercloud-javascript-sdk";
import { ContentTextFormat } from "material-ui/svg-icons";

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

class App extends React.Component<AppProps, AppState> {
  componentDidMount = () => {
    const { cookies } = this.props;
    if (cookies) {
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

  intializeOrderCloud = (token?: string) => {
    if (!token) return this.setInitialState();
    this.setState({
      context: {
        token: token
      }
    });
    OrderCloud.Sdk.instance.authentications["oauth2"].accessToken = token;
    return OrderCloud.Me.Get().then(user => {
      return OrderCloud.Me.ListUserGroups({ pageSize: 100 }).then(
        listUserGroups => {
          this.setState(state => {
            return {
              ...state,
              context: {
                token: token,
                user: user,
                groups: listUserGroups.Items
              }
            };
          });
        }
      );
    });
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
