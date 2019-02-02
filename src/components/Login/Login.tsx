import React, { Component } from "react";

import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  withStyles,
  Snackbar,
  Zoom,
  Fade
} from "@material-ui/core";

import { Visibility, VisibilityOff, Close } from "@material-ui/icons";

import LoginStyles from "./LoginStyles";
import { ApiRole, Auth, AccessToken } from "ordercloud-javascript-sdk";
import Alert from "../Alerts/Alert";

interface LoginProps {
  scope: ApiRole[];
  clientId: string;
  classes: any;
  onSubmit: (auth: AccessToken, remember: boolean) => void;
}

export interface LoginState {
  password: string;
  username: string;
  remember: boolean;
  showPassword: boolean;
  error: string | null;
  showError: boolean;
  show: boolean;
  showForm: boolean;
}

class Login extends Component<LoginProps, LoginState> {
  public state = {
    password: "",
    username: "",
    remember: false,
    showPassword: false,
    showError: false,
    showForm: true,
    show: true,
    error: null
  };

  public handleInputChangeFor = (inputName: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({
      ...this.state,
      [inputName]: event.target.value
    });
  };

  public handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  public handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const { clientId, scope } = this.props;
    const { username, password, remember } = this.state;
    this.setState({ showForm: false });
    Auth.Login(username, password, clientId, scope)
      .then(user => this.props.onSubmit(user, remember))
      .catch(this.handleError);
  };

  public handleCloseError = () => {
    this.setState({ showError: false });
  };

  public handleError = (error: {
    response: { body: { error_description: string } };
  }) => {
    this.setState({
      show: true,
      showForm: true,
      showError: true,
      error: error.response.body.error_description
    });
  };

  public render() {
    const { classes } = this.props;
    return (
      <Fade in={this.state && this.state.show}>
        <div className={classes.root}>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={this.state.showError}
            onClose={this.handleCloseError}
            message={
              <span id="login-error-message">
                {(this.state && this.state.error && `${this.state.error}`) ||
                  "An Error Occured"}
              </span>
            }
          >
            <Alert
              variant="error"
              onClose={this.handleCloseError}
              message={
                <span id="login-error-message">
                  {(this.state && this.state.error && `${this.state.error}`) ||
                    "An Error Occured"}
                </span>
              }
            />
          </Snackbar>
          <Zoom in={this.state.showForm}>
            <form onSubmit={this.handleSubmit} className={classes.form}>
              <img
                className={classes.logo}
                src="/logo_purple.png"
                alt="OrderCloud.io"
              />
              <Typography variant="subtitle1" color="default" gutterBottom>
                Commerce Admin
              </Typography>
              <TextField
                className={classes.textFields}
                type="text"
                label="Username"
                value={this.state.username}
                onChange={this.handleInputChangeFor("username")}
              />
              <TextField
                className={classes.textFields}
                type={this.state.showPassword ? "text" : "password"}
                label="Password"
                value={this.state.password}
                onChange={this.handleInputChangeFor("password")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment variant="filled" position="end">
                      <Tooltip
                        title={
                          this.state.showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        <IconButton
                          aria-label="Toggle password visibility"
                          onClick={this.handleClickShowPassword}
                        >
                          {this.state.showPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  )
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.remember}
                    onChange={this.handleInputChangeFor("remember")}
                    value="remember"
                  />
                }
                label="Keep me logged in"
              />
              <Button
                className={classes.loginButton}
                variant="contained"
                color="primary"
                size="large"
                type="submit"
              >
                Login
              </Button>
            </form>
          </Zoom>
        </div>
      </Fade>
    );
  }
}

export default withStyles(LoginStyles)(Login);
