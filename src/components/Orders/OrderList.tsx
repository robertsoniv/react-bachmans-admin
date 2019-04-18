import {
  Table,
  TableHead,
  withStyles,
  Theme,
  createStyles,
  TableRow,
  TableCell,
  TableBody
} from "@material-ui/core";
import { Orders, Order, Meta } from "ordercloud-javascript-sdk";
import React from "react";
import moment from "moment-timezone";
import Currency from "react-currency-formatter";
import ContentLoading from "../Layout/ContentLoading";

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
  onChange: (meta?: Meta) => void;
  classes: any;
  tab: string;
  search?: string;
  from?: string;
  to?: string;
}

const DEFAULT_OPTIONS: any = {
  sortBy: "!ID",
  pageSize: 10
};

const TAB_FILTERS_MAP: { [tabKey: string]: any } = {
  all: { Status: "!Unsubmitted" },
  processing: { Status: "Open" },
  completed: { Status: "Completed" }
};

interface OrderListState {
  list?: Order[];
}
class OrderList extends React.Component<OrderListProps, OrderListState> {
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
    this.setState({ list: undefined });
    Orders.List("incoming", {
      search,
      from: from
        ? moment(from, "YYYY-MM-DD")
            .tz("America/Chicago")
            .startOf("d")
            .format("YYYY-MM-DD HH:mm:ss ZZ")
        : undefined,
      to: to
        ? moment(to, "YYYY-MM-DD")
            .tz("America/Chicago")
            .endOf("d")
            .format("YYYY-MM-DD HH:mm:ss ZZ")
        : undefined,
      filters: filters,
      ...DEFAULT_OPTIONS
    }).then(data => {
      this.setState({ list: data.Items });
      this.props.onChange(data.Meta);
    });
  };

  public getTabFilters = (tab: string) => {
    return TAB_FILTERS_MAP[tab] || TAB_FILTERS_MAP["all"];
  };
  public render() {
    if (this.state && this.state.list) {
      const { classes } = this.props;
      const { list } = this.state;
      return (
        <div className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Time</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell align="right">Subtotal</TableCell>
                <TableCell align="right">Shipping</TableCell>
                <TableCell align="right">Tax</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list &&
                list.map(order => (
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
    return <ContentLoading type="table" rows={6} />;
  }
}

export default withStyles(styles)(OrderList);
