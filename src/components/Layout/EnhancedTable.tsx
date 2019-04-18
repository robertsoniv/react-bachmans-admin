import React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  Paper,
  StyledComponentProps,
  Table,
  TableHead,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
  Checkbox
} from "@material-ui/core";

type CellValueFunction = (row: any) => any;

type CellValue = string | CellValueFunction;

interface EnhancedTableColumn {
  label: string;
  value: CellValue;
}

interface EnhancedTableProps extends StyledComponentProps {
  columns: EnhancedTableColumn[];
  data: Array<any>;
  select?: boolean;
  renderValue?: (row: any, column: EnhancedTableColumn, value: any) => any;
}

interface EnhancedTableState {
  selected: string[];
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      borderRadius: 0
    }
  });

class EnhancedTable extends React.Component<
  EnhancedTableProps,
  EnhancedTableState
> {
  public state = {
    selected: new Array()
  };

  public componentDidMount = () => {};

  public handleSelectClick = (index: number) => (event: React.MouseEvent) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(index);
    let newSelected = new Array();

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, index);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({ selected: newSelected });
  };

  public handleSelectAllClick = (event: React.MouseEvent) => {
    const { data } = this.props;
    const { selected } = this.state;
    this.setState({
      selected:
        selected.length === data.length
          ? new Array()
          : data.map((item, index) => index)
    });
  };

  public tableHead = () => {
    const { columns, select, data } = this.props;
    const { selected } = this.state;
    return (
      <TableHead>
        <TableRow>
          {select && this.state && (
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                indeterminate={
                  selected.length > 0 && selected.length < data.length
                }
                checked={selected.length === data.length}
                onClick={this.handleSelectAllClick}
              />
            </TableCell>
          )}
          {columns.map(this.tableHeadCell)}
        </TableRow>
      </TableHead>
    );
  };

  public tableHeadCell = (column: EnhancedTableColumn, index: number) => {
    return <TableCell>{column.label}</TableCell>;
  };

  public tableBodyRow = (row: any, index: number) => {
    const { columns, select } = this.props;
    const { selected } = this.state;
    return (
      <TableRow key={index}>
        {select && (
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              checked={selected.indexOf(index) > -1}
              onClick={this.handleSelectClick(index)}
            />
          </TableCell>
        )}
        {columns.map(this.tableBodyCell(row, index))}
      </TableRow>
    );
  };

  public tableBodyCell = (row: any, rowIndex: number) => (
    col: EnhancedTableColumn,
    colIndex: number
  ) => {
    return (
      <TableCell key={`${rowIndex}_${colIndex}`}>
        {this.parseCellValue(row, col, col.value)}
      </TableCell>
    );
  };

  public parseCellValue = (
    row: any,
    column: EnhancedTableColumn,
    cellValue: CellValue
  ) => {
    let value: any;
    switch (typeof cellValue) {
      case "string":
        const splitPath = cellValue.split(".");
        splitPath.forEach(partial => {
          value = value ? value[partial] : row[partial];
        });
        break;
      default:
        value = cellValue(row);
        break;
    }

    if (this.props.renderValue) {
      return this.props.renderValue(row, column, value);
    }
    return value;
  };

  public tableFooter = () => {
    return <TableFooter />;
  };

  public render() {
    const { data } = this.props;
    const classes = this.props.classes!;
    const tableHead = this.tableHead();
    const tableFooter = this.tableFooter();
    return (
      <Paper className={classes.root} elevation={0}>
        <Table className={classes.paper}>
          {tableHead}
          <TableBody>{data.map(this.tableBodyRow)}</TableBody>
          {tableFooter}
        </Table>
      </Paper>
    );
  }
}

export default withStyles(styles)(EnhancedTable);
