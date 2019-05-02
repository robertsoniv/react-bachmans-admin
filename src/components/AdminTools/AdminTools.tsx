import React from "react";
import {
  withStyles,
  Theme,
  createStyles,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  CardActionArea,
  Avatar
} from "@material-ui/core";
import { RouteComponentProps } from "react-router";
import { People, Lock } from "@material-ui/icons";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing.unit * 2
    },
    card: {
      marginBottom: theme.spacing.unit * 2
    }
  });

interface AdminToolsProps extends RouteComponentProps {
  classes: any;
}

class AdminTools extends React.Component<AdminToolsProps> {
  public buildOnClick = (path: string) => (event: React.MouseEvent) => {
    const { history } = this.props;
    history.push(path);
  };

  public render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          <CardActionArea onClick={this.buildOnClick("/admin/users")}>
            <CardHeader
              avatar={
                <Avatar>
                  <People />
                </Avatar>
              }
              title="Internal Users"
              subheader="Manage all Internal Bachman's users and their User Role assignments."
            />
          </CardActionArea>
        </Card>
        <Card className={classes.card}>
          <CardActionArea onClick={this.buildOnClick("/admin/roles")}>
            <CardHeader
              avatar={
                <Avatar>
                  <Lock />
                </Avatar>
              }
              title="User Roles"
              subheader="Manage the User Roles and Permissions for Internal Users"
            />
          </CardActionArea>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(AdminTools);
