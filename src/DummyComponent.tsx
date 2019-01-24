import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Paper,
  InputBase,
  Divider,
  Input,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from "@material-ui/core";
import ComponentNavTabs from "./ComponentNavTabs";

interface OrdersProps {
  match: any;
  history: any;
}

interface OrdersParamsFilters {
  [filterKey: string]: null | string | number;
}

interface OrdersParams {
  direction: string;
  buyerid?: string;
  from?: string;
  to?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  filters?: OrdersParamsFilters;
}

interface OrdersState {
  params: OrdersParams;
}

export class Orders extends React.Component<OrdersProps, OrdersState> {
  public state = {
    params: {
      direction: "incoming"
    }
  };
  public handleSearchSubmit = (event: React.FormEvent) => {};
  public render() {
    return (
      <React.Fragment>
        <AppBar color="secondary" position="static">
          <Toolbar>
            <Typography variant="h5" color="inherit">
              Order Management
            </Typography>
            <div style={{ flexGrow: 1 }} />
            <Button color="primary" variant="contained">
              Build Order
            </Button>
          </Toolbar>
          <ComponentNavTabs {...this.props} baseUri="/orders" />
        </AppBar>
        <Paper style={{ margin: 16 }} elevation={1}>
          <OrderSearch
            {...this.state.params}
            onSubmit={this.handleSearchSubmit}
          />
          <OrderList {...this.state.params} {...this.props.match} />
        </Paper>
      </React.Fragment>
    );
  }
}

interface OrderSearchProps extends OrdersParams {
  onSubmit: (event: React.FormEvent) => void;
}

export class OrderSearch extends React.Component<OrderSearchProps> {
  public onChange = (event: React.ChangeEvent) => {};
  public render() {
    return (
      <Input
        fullWidth
        placeholder="Find an order..."
        value={this.props.search}
      />
    );
  }
}
let id = 0;
function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9)
];
export class OrderList extends React.Component<any> {
  public render() {
    console.log(this.props);
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat (g)</TableCell>
            <TableCell align="right">Carbs (g)</TableCell>
            <TableCell align="right">Protein (g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

export class Customers extends React.Component<OrdersProps> {
  public render() {
    return (
      <AppBar color="secondary" position="static">
        <Toolbar>
          <Typography variant="h5" color="inherit">
            Bachman's Customers
          </Typography>
          <div style={{ flexGrow: 1 }} />
          <Button color="primary" variant="contained">
            New Customer
          </Button>
        </Toolbar>
        <ComponentNavTabs {...this.props} baseUri="/customers" />
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
