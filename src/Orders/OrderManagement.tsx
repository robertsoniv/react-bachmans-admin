import React from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Theme,
  createStyles,
  withStyles
} from "@material-ui/core";

import { RouteComponentProps } from "react-router";
import OrderList from "./OrderList";
import SearchField from "../SearchField/SearchField";

import DateRangeSelector from "../DateRangeSelector/DateRangeSelector";

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
}

const styles = (theme: Theme) =>
  createStyles({
    orderFilters: {
      display: "flex",
      flexFlow: "row nowrap",
      alignItems: "center",
      margin: theme.spacing.unit * 2
    }
  });

class OrderManagement extends React.Component<
  OrderManagementProps,
  OrderManagementState
> {
  componentDidMount = () => {
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

  componentDidUpdate = (prevProps: OrderManagementProps) => {
    if (prevProps.match.params.tab !== this.props.match.params.tab) {
      this.setState({
        activeTab: this.props.match.params.tab || "all",
        search: "",
        from: null,
        to: null
      });
    } else if (prevProps.location.search !== this.props.location.search) {
      const params = new URLSearchParams(this.props.location.search);
      const search: any = params.get("search");
      const from: string | null = params.get("from");
      const to: string | null = params.get("to");
      this.setState({
        search,
        from,
        to
      });
    }
  };

  public handleTabchange = (event: React.ChangeEvent<{}>, value: any) => {
    const childPath = value === "all" ? "" : "/" + value;
    this.props.history.push({
      pathname: "/orders" + childPath,
      search: ""
    });
  };

  public handleSearch = (value?: string) => {
    const params = new URLSearchParams(this.props.location.search);
    value ? params.set("search", value) : params.delete("search");
    this.pushSearchParams(params);
  };

  public handleDateRangeChange = (
    startDate: string | null,
    endDate: string | null
  ) => {
    const params = new URLSearchParams(this.props.location.search);
    startDate ? params.set("from", startDate) : params.delete("from");
    endDate ? params.set("to", endDate) : params.delete("to");
    this.pushSearchParams(params);
  };

  public pushSearchParams(params: URLSearchParams) {
    this.props.history.push({
      ...this.props.location,
      search: params.toString()
    });
  }

  public render() {
    const { classes } = this.props;
    return this.state ? (
      <React.Fragment>
        <AppBar color="secondary" position="static">
          <Tabs
            value={this.state.activeTab}
            indicatorColor="primary"
            onChange={this.handleTabchange}
          >
            <Tab label="All Orders" value="all" />
            <Tab label="Processing" value="processing" />
            <Tab label="Completed" value="completed" />
            <Tab label="Exceptions" value="exceptions" />
          </Tabs>
        </AppBar>
        <div className={classes.orderFilters}>
          <SearchField onSearch={this.handleSearch} value={this.state.search} />
          <DateRangeSelector
            startDate={this.state.from}
            endDate={this.state.to}
            onChange={this.handleDateRangeChange}
            format={"MM-DD-YYYY"}
          />
        </div>
        <OrderList
          tab={this.state.activeTab}
          search={this.state.search}
          from={this.state.from}
          to={this.state.to}
        />
      </React.Fragment>
    ) : (
      "loading"
    );
  }
}

export default withStyles(styles)(OrderManagement);
