import React from "react";
import {
  Tabs,
  Tab,
  Theme,
  createStyles,
  withStyles,
  Toolbar,
  Paper,
  Typography
} from "@material-ui/core";

import { RouteComponentProps } from "react-router";
import OrderList from "./OrderList";
import SearchField from "../SearchField/SearchField";

import DateRangeSelector from "../DateRangeSelector/DateRangeSelector";
import ButtonLink from "../Shared/ButtonLink";
import { Meta } from "ordercloud-javascript-sdk";

interface OrderManagementParams {
  tab?: string;
}

interface OrderManagementProps
  extends RouteComponentProps<OrderManagementParams> {
  classes: any;
}

interface OrderManagementState {
  activeTab: string;
  search: string;
  from: string | null;
  to: string | null;
  meta?: Meta;
}

const styles = (theme: Theme) =>
  createStyles({
    toolbar: {
      marginTop: theme.spacing.unit * 2
    },
    tabs: {},
    paperHeader: {
      borderBottom: "1px solid " + theme.palette.grey[300],
      display: "flex",
      alignItems: "center"
    },
    meta: {
      marginRight: theme.spacing.unit * 3
    },
    paper: {
      margin: `${theme.spacing.unit * 1}px ${theme.spacing.unit * 3}px ${theme
        .spacing.unit * 3}px`
    },
    grow: {
      flexGrow: 1
    }
  });

class OrderManagement extends React.Component<
  OrderManagementProps,
  OrderManagementState
> {
  componentDidMount = () => {
    this.updateParamState();
  };

  componentDidUpdate = (prevProps: OrderManagementProps) => {
    if (prevProps.match.params.tab !== this.props.match.params.tab) {
      this.setState({
        activeTab: this.props.match.params.tab || "all"
      });
    } else if (prevProps.location.search !== this.props.location.search) {
      this.updateParamState();
    }
  };

  public handleTabchange = (event: React.ChangeEvent<{}>, value: any) => {
    const childPath = value === "all" ? "" : "/" + value;
    this.props.history.push({
      pathname: "/orders" + childPath,
      search: this.props.location.search
    });
  };

  public handleListUpdate = (meta?: Meta) => {
    this.setState({ meta });
  };

  public updateParamState = () => {
    const params = new URLSearchParams(this.props.location.search);
    const search: any = params.get("search");
    const from: string | null = params.get("from");
    const to: string | null = params.get("to");
    this.setState({
      activeTab: this.props.match.params.tab || "all",
      search,
      from,
      to
    });
  };

  public handleParamUpdate = (newParams: Object) => {
    const params = new URLSearchParams(this.props.location.search);
    Object.entries(newParams).forEach(([name, value]: [string, string]) => {
      value ? params.set(name, value) : params.delete(name);
    });
    this.props.history.push({
      ...this.props.location,
      search: params.toString()
    });
  };

  public render() {
    const { classes } = this.props;
    return this.state ? (
      <React.Fragment>
        <Toolbar className={classes.toolbar}>
          <SearchField
            placeholder="Search by Order ID"
            onSearch={this.handleParamUpdate}
            value={this.state.search}
          />
          <DateRangeSelector
            numberOfMonths={2}
            startDate={this.state.from}
            endDate={this.state.to}
            onChange={this.handleParamUpdate}
            format={"YYYY-MM-DD"}
          />

          <div className={classes.grow} />
          <ButtonLink
            size="large"
            to="/orders/build"
            color="secondary"
            variant="contained"
          >
            Build Order
          </ButtonLink>
        </Toolbar>
        <Paper className={classes.paper}>
          <div className={classes.paperHeader}>
            <Tabs
              className={classes.tabs}
              value={this.state.activeTab}
              indicatorColor="primary"
              onChange={this.handleTabchange}
            >
              <Tab label="All Orders" value="all" />
              <Tab label="Processing" value="processing" />
              <Tab label="Completed" value="completed" />
              <Tab label="Exceptions" value="exceptions" />
            </Tabs>
            <div className={classes.grow} />
            {this.state.meta && this.state.meta.ItemRange ? (
              <Typography
                variant="body1"
                align="center"
                className={classes.meta}
              >{`Showing ${this.state.meta.ItemRange[0]} - ${
                this.state.meta.ItemRange[1]
              } of ${this.state.meta.TotalCount}`}</Typography>
            ) : (
              <div className={classes.grow} />
            )}
          </div>
          <OrderList
            onChange={this.handleListUpdate}
            tab={this.state.activeTab}
            search={this.state.search}
            from={this.state.from || undefined}
            to={this.state.to || undefined}
          />
        </Paper>
      </React.Fragment>
    ) : (
      "loading"
    );
  }
}

export default withStyles(styles)(OrderManagement);
