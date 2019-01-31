import React from "react";
import { Moment } from "moment";
import Case from "case";
import { Typography, Paper } from "@material-ui/core";

interface OrderListProps {
  tab: string;
  search?: string;
  from: string | null;
  to: string | null;
}

const OrderList: React.FunctionComponent<OrderListProps> = ({
  tab,
  search,
  from,
  to
}) => {
  return (
    <Paper style={{ margin: 16, padding: 8 }} elevation={1}>
      <Typography variant="h6">{`${Case.title(tab)} Orders`}</Typography>
      {search && <Typography variant="body1">Search term: {search}</Typography>}
      {from && <Typography variant="body1">From: {from}</Typography>}
      {to && <Typography variant="body1">To: {to}</Typography>}
    </Paper>
  );
};

export default OrderList;
