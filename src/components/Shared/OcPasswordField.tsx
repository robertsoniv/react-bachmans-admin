import React from "react";
import {
  TextField,
  withStyles,
  Theme,
  createStyles,
  Typography
} from "@material-ui/core";

const styles = (theme: Theme) => createStyles({});

interface OcPasswordFieldProps {
  classes: any;
  value: string;
  required?: boolean;
  onChange: (password: string) => void;
}

interface OcPasswordFieldState {
  password: string;
  confirmation: string;
  passwordValid: boolean;
  confirmValid: boolean;
}

const passwordRequirements =
  "Password must be at least eight characters long and include at least one letter and one number. Passwords can also contain the following special characters: ! @ # $ %";

const passwordRegex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#]{8,}$/);

class OcPasswordField extends React.Component<
  OcPasswordFieldProps,
  OcPasswordFieldState
> {
  public componentDidMount = () => {
    this.setState({ password: this.props.value || "", confirmation: "" });
  };

  public componentDidUpdate = (
    prevProps: OcPasswordFieldProps,
    prevState: OcPasswordFieldState
  ) => {
    const { password, passwordValid, confirmValid } = this.state;
    if (
      passwordValid &&
      confirmValid &&
      (password !== prevState.password ||
        confirmValid !== prevState.confirmValid ||
        passwordValid !== prevState.passwordValid)
    ) {
      this.props.onChange(password);
    }
  };

  public validatePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    this.setState({
      password: value,
      passwordValid: passwordRegex.test(value),
      confirmValid: value == this.state.confirmation
    });
  };

  public onConfirmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    this.setState({
      confirmation: value,
      confirmValid: this.state.password == value
    });
  };

  public render() {
    return this.state ? (
      <React.Fragment>
        <TextField
          fullWidth
          margin="dense"
          label="Password"
          type="password"
          onChange={this.validatePassword}
          required={Boolean(this.props.required)}
          value={this.state.password}
          variant="outlined"
          helperText={
            this.state.password &&
            !this.state.passwordValid && (
              <Typography variant="inherit" color="error">
                {passwordRequirements}
              </Typography>
            )
          }
        />
        <TextField
          fullWidth
          margin="dense"
          label="Confirm Password"
          type="password"
          onChange={this.onConfirmChange}
          required={Boolean(this.state.password)}
          value={this.state.confirmation}
          helperText={
            this.state.confirmation &&
            !this.state.confirmValid && (
              <Typography variant="inherit" color="error">
                Passwords do not match
              </Typography>
            )
          }
          variant="outlined"
        />
      </React.Fragment>
    ) : (
      "Loading"
    );
  }
}

export default withStyles(styles)(OcPasswordField);
