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
import OrderCloud, {
  SecurityProfileAssignment
} from "ordercloud-javascript-sdk";
import jwtDecode from "jwt-decode";
import classNames from "classnames";
import { pick, flatten } from "lodash";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      height: "100vh",
      width: "100vw",
      overflowX: "hidden",
      display: "flex"
    },
    bgImageBase: {
      opacity: 0,
      transition: theme.transitions.create("opacity")
    },
    bgImage: {
      opacity: 1,
      zIndex: 0,
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundImage: 'url("/login_bg.jpg")',
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat"
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
    this.setState({
      mobileOpen: !this.state.mobileOpen
    });
  };

  handleLogin = (auth: OrderCloud.AccessToken, remember: boolean) => {
    if (auth.access_token) {
      const { cookies } = this.props;
      if (cookies) {
        cookies.set("token", auth.access_token);
        if (remember) {
          cookies.set("refresh_token", auth.refresh_token);
        }
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
        pageSize: 100,
        filters: {
          "xp.IsPermissionGroup": "true"
        }
      });

      const queue = new Array();
      if (listUserGroups.Items && listUserGroups.Items.length) {
        listUserGroups.Items.forEach(ug => {
          queue.push(
            OrderCloud.SecurityProfiles.ListAssignments({
              pageSize: 100,
              userGroupID: ug.ID
            })
          );
        });
      }

      const results = await Promise.all(queue);
      const permissions = flatten(
        results.map(response =>
          response.Items.map(
            (i: SecurityProfileAssignment) => i.SecurityProfileID
          )
        )
      );
      console.log(permissions);

      this.setState(state => {
        return {
          ...state,
          context: {
            token,
            user,
            permissions
          }
        };
      });
    } catch (e) {
      this.setInitialState();
    }
  };

  public handleLogout = () => {
    const { cookies } = this.props;
    if (cookies) {
      cookies.remove("token");
    }
    delete OrderCloud.Sdk.instance.authentications["oauth2"].accessToken;
    this.setInitialState();
  };

  render() {
    const { classes } = this.props;
    const hasContext = Boolean(
      this.state &&
        this.state.context &&
        OrderCloud.Sdk.instance.authentications["oauth2"].accessToken
    );
    return (
      <div className={classes.root}>
        <div
          className={classNames({
            [classes.bgImageBase]: true,
            [classes.bgImage]: !hasContext
          })}
        />
        <CssBaseline />
        <Router>
          {this.state ? (
            hasContext ? (
              <AppContext.Provider value={this.state.context}>
                <AppHeader
                  onLogout={this.handleLogout}
                  onDrawerToggle={this.handleDrawerToggle}
                />
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
