import {
  Paper,
  Table,
  TableHead,
  withStyles,
  Theme,
  createStyles,
  TableRow,
  TableCell,
  TableBody,
  Typography
} from "@material-ui/core";
import { ListOrder, Orders } from "ordercloud-javascript-sdk";
import React from "react";
import moment from "moment-timezone";
import Currency from "react-currency-formatter";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      overflowX: "auto"
    },
    metaData: {
      marginTop: theme.spacing.unit,
      marginLeft: theme.spacing.unit * 3,
      marginRight: theme.spacing.unit * 3
    }
  });

interface OrderListProps {
  classes: any;
  tab: string;
  search?: string;
  from?: string;
  to?: string;
}

const DEFAULT_OPTIONS: any = {
  sortBy: "!ID",
  pageSize: 100
};

const TAB_FILTERS_MAP: { [tabKey: string]: any } = {
  all: { Status: "!Unsubmitted" },
  processing: { Status: "Open" },
  completed: { Status: "Completed" }
};

class OrderList extends React.Component<OrderListProps, ListOrder> {
  componentDidMount = () => {
    this.retrieveList();
  };

  componentDidUpdate = (prev: OrderListProps) => {
    const { search, from, to, tab } = this.props;
    if (
      search !== prev.search ||
      from !== prev.from ||
      to !== prev.to ||
      tab !== prev.tab
    ) {
      this.retrieveList();
    }
  };

  public retrieveList = () => {
    const { tab, search, from, to } = this.props;
    const filters = this.getTabFilters(tab);
    Orders.List("incoming", {
      search,
      from: from,
      to: to,
      filters: filters,
      ...DEFAULT_OPTIONS
    }).then(data => this.setState({ ...data }));
  };

  public getTabFilters = (tab: string) => {
    return TAB_FILTERS_MAP[tab] || TAB_FILTERS_MAP["all"];
  };
  public render() {
    if (this.state) {
      const { classes } = this.props;
      const { Items, Meta } = this.state;
      return (
        <div className={classes.root}>
          {Meta && Meta.ItemRange && (
            <Typography
              align="left"
              className={classes.metaData}
              variant="body2"
            >{`Showing ${Meta.ItemRange[0]} - ${Meta.ItemRange[1]} of ${
              Meta.TotalCount
            }`}</Typography>
          )}
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Time</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell align="right">SubTotal</TableCell>
                <TableCell align="right">Shipping</TableCell>
                <TableCell align="right">Tax</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Items &&
                Items.map(order => (
                  <TableRow key={order.ID}>
                    <TableCell component="th" scope="row">
                      {order.ID}
                    </TableCell>
                    <TableCell align="center">
                      {moment(order.DateSubmitted)
                        .tz("America/Chicago")
                        .format("M/D/YY")}
                    </TableCell>
                    <TableCell align="center">
                      {moment(order.DateSubmitted)
                        .tz("America/Chicago")
                        .format("h:mm a")}
                    </TableCell>
                    <TableCell>{order.FromUserID}</TableCell>
                    <TableCell align="right">
                      <Currency quantity={order.Subtotal || 0} />
                    </TableCell>
                    <TableCell align="right">
                      <Currency quantity={order.ShippingCost || 0} />
                    </TableCell>
                    <TableCell align="right">
                      <Currency quantity={order.TaxCost || 0} />
                    </TableCell>
                    <TableCell align="right">
                      <Currency quantity={order.Total || 0} />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      );
    }
    return "Loading data";
  }
}

export default withStyles(styles)(OrderList);
