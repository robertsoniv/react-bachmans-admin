import React from "react";
import { Tabs, Tab, AppBar, Toolbar, Typography } from "@material-ui/core";
import ComponentRoutes from "./constants/Navigation.constants";

interface OrderListProps {
  match: any;
  history: any;
}

export class Orders extends React.Component<OrderListProps> {
  public baseRoute = "/orders";

  public handleChange = (event: any, value: string) => {
    this.props.history.push(value);
  };

  public render() {
    const filter = this.props.match.path;
    return (
      <AppBar color="secondary" position="static">
        <Toolbar>
          <Typography variant="h5" color="inherit">
            Order Management
          </Typography>
        </Toolbar>
        <Tabs
          value={filter}
          indicatorColor="primary"
          onChange={this.handleChange}
        >
          {Object.entries(ComponentRoutes[this.baseRoute].children).map(
            ([childPath, childComponent]: [string, any]) =>
              !childComponent.$ref && (
                <Tab
                  key={this.baseRoute + childPath}
                  value={this.baseRoute + childPath}
                  label={childComponent.tabLabel || childComponent.label}
                />
              )
          )}
        </Tabs>
      </AppBar>
    );
  }
}
export class Customers extends React.Component<OrderListProps> {
  public baseRoute = "/customers";

  public handleChange = (event: any, value: string) => {
    this.props.history.push(value);
  };

  public render() {
    const filter = this.props.match.path;
    return (
      <AppBar color="secondary" position="static">
        <Toolbar>
          <Typography variant="h5" color="inherit">
            Bachman's Customers
          </Typography>
        </Toolbar>
        <Tabs
          value={filter}
          indicatorColor="primary"
          onChange={this.handleChange}
        >
          {Object.entries(ComponentRoutes[this.baseRoute].children).map(
            ([childPath, childComponent]: [string, any]) =>
              !childComponent.$ref && (
                <Tab
                  key={this.baseRoute + childPath}
                  value={this.baseRoute + childPath}
                  label={childComponent.tabLabel || childComponent.label}
                />
              )
          )}
        </Tabs>
      </AppBar>
    );
  }
}

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
