import React from "react";
import {
  Tabs,
  Tab,
  AppBar,
  withStyles,
  Theme,
  createStyles,
  Toolbar,
  Typography
} from "@material-ui/core";
import { NavLink } from "react-router-dom";
import ComponentRoutes from "./constants/Navigation.constants";

interface OrderListProps {
  match: any;
  classes: any;
  history: any;
}

const styles = (theme: Theme) => createStyles({});

class Orders extends React.Component<OrderListProps> {
  public baseRoute = "/orders";

  public handleChange = (event: any, value: string) => {
    this.props.history.push(value);
  };

  public render() {
    const { classes } = this.props;
    const filter = this.props.match.path;
    return (
      <AppBar className={classes.appBar} color="secondary" position="static">
        <Toolbar>
          <Typography variant="h5" color="inherit">
            Order Management
          </Typography>
        </Toolbar>
        <Tabs
          value={filter}
          className={classes.tabs}
          indicatorColor="primary"
          onChange={this.handleChange}
        >
          {Object.entries(ComponentRoutes[this.baseRoute].children).map(
            ([childPath, childComponent]: [string, any]) =>
              !childComponent.$ref && (
                <Tab
                  key={this.baseRoute + childPath}
                  value={this.baseRoute + childPath}
                  label={childComponent.label}
                />
              )
          )}
        </Tabs>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Orders);

export class BuildOrder extends React.Component {
  public render() {
    return "Build Order";
  }
}

export class DummyComponent extends React.Component<{ match: any }> {
  public render() {
    return <pre>{JSON.stringify(this.props.match, null, 2)}</pre>;
  }
}
