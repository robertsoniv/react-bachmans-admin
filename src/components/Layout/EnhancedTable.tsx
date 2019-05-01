import React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
  Checkbox,
  IconButton,
  Tooltip,
  TableSortLabel
} from "@material-ui/core";
import { TableCellProps } from "@material-ui/core/TableCell";
import { IconProps } from "@material-ui/core/Icon";
import { uniq } from "lodash";
import { fade } from "@material-ui/core/styles/colorManipulator";
import ContentLoading from "./ContentLoading";
import IconButtonLink from "./IconButtonLink";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      borderRadius: 0
    },
    tableActionCell: {
      position: "relative",
      width: 0
    },
    tableRowActions: {
      paddingLeft: theme.spacing.unit * 5,
      paddingRight: theme.spacing.unit * 1,
      background: `linear-gradient(to right, ${fade(
        theme.palette.grey[200],
        0
      )} 0%,${fade(theme.palette.grey[200], 1)} 12%,${fade(
        theme.palette.grey[200],
        1
      )} 100%);`,
      opacity: 0,
      display: "flex",
      flexFlow: "row nowrap",
      alignItems: "center",
      position: "absolute",
      right: 0,
      top: 0,
      bottom: 0
    },
    tableRowAction: {
      padding: 10
    },
    tableBodyRow: {
      "&:hover $tableRowActions": {
        opacity: 1
      },
      "&:hover": {
        background: theme.palette.grey[200]
      }
    }
  });

type CellValueFunction = (row: any) => any;

type CellValue = string | CellValueFunction;

export interface EnhancedTableColumn {
  label: string;
  value: CellValue;
  CellProps?: TableCellProps;
  sortable?: boolean;
}

export interface EnhancedTableRowAction {
  title: string;
  icon: React.ReactElement<IconProps>;
  link?: (row: any) => string;
  onClick?: (row: any) => (event: React.MouseEvent) => void;
}

interface EnhancedTableProps {
  classes: any;
  columns: EnhancedTableColumn[];
  data?: any[];
  sortBy?: string;
  selectable?: boolean;
  selected?: string[];
  rowActions?: EnhancedTableRowAction[];
  cellRenderer?: (row: any, column: EnhancedTableColumn, value: any) => any;
  onSelect?: (selected: number[]) => void;
  onSort?: (newSort?: string) => void;
}

interface EnhancedTableState {
  selected: string[];
}

class EnhancedTable extends React.Component<
  EnhancedTableProps,
  EnhancedTableState
> {
  public mapSelected = (selectedIds: string[]): number[] => {
    const { data } = this.props;
    const selected = new Array();
    if (data && data.length) {
      data.forEach((item, index) => {
        if (selectedIds.includes(item.ID)) {
          selected.push(index);
        }
      });
    }
    return selected;
  };

  public state = {
    selected: this.props.selected
      ? this.mapSelected(this.props.selected)
      : new Array()
  };

  public componentDidUpdate = (
    prevProps: EnhancedTableProps,
    prevState: EnhancedTableState
  ) => {
    const { data, onSelect } = this.props;
    const { selected } = this.state;
    if (data !== prevProps.data) {
      this.setState({ selected: new Array() });
    }
    if (onSelect && selected !== prevState.selected) {
      onSelect(selected);
    }
  };

  public handleSelectClick = (index: number) => (event: React.MouseEvent) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(index);
    let newSelected = new Array();

    if (selectedIndex === -1) {
      if (event.shiftKey) {
        const newIndices = new Array();
        const lastAdded = selected[selected.length - 1];
        let low = lastAdded;
        let high = index;
        if (lastAdded > index) {
          low = index;
          high = lastAdded;
        }
        for (let i = low; i < high; i++) {
          if (i !== index) newIndices.push(i);
        }
        newSelected = newSelected.concat(selected, newIndices, index);
      } else {
        newSelected = newSelected.concat(selected, index);
      }
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

    this.setState({ selected: uniq(newSelected) });
  };

  public handleSelectAllClick = (event: React.MouseEvent) => {
    const { data } = this.props;
    const { selected } = this.state;
    if (!data) return;
    this.setState({
      selected:
        selected.length === data.length
          ? new Array()
          : data.map((item, index) => index)
    });
  };

  public handleSortClick = (newSort?: string) => (event: React.MouseEvent) => {
    if (this.props.onSort) {
      this.props.onSort(newSort);
    }
  };

  public tableHead = () => {
    const { columns, selectable, rowActions, data } = this.props;
    let someSelected = false;
    let allSelected = false;
    if (this.state && data) {
      const { length } = this.state.selected;
      someSelected = length > 0 && length < data.length;
      allSelected = Boolean(data.length && length === data.length);
    }
    return (
      <TableHead>
        <TableRow>
          {selectable && (
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                indeterminate={someSelected}
                checked={allSelected}
                onClick={this.handleSelectAllClick}
              />
            </TableCell>
          )}
          {columns.map(this.tableHeadCell)}
          {rowActions && rowActions.length && <TableCell padding="checkbox" />}
        </TableRow>
      </TableHead>
    );
  };

  public tableHeadCell = (column: EnhancedTableColumn, index: number) => {
    if (column.sortable) {
      const { sortBy } = this.props;
      let sortId,
        order = false;
      if (sortBy) {
        order = sortBy.indexOf("!") === 0;
        sortId = order ? sortBy.slice(1) : sortBy;
      }
      const newSortId = column.value as string;
      const newSort =
        sortId === newSortId
          ? order
            ? undefined
            : `!${newSortId}`
          : newSortId;
      return (
        <TableCell key={index} {...column.CellProps}>
          <Tooltip title="Sort" enterDelay={300}>
            <TableSortLabel
              active={sortId == (column.value as string)}
              direction={order ? "asc" : "desc"}
              onClick={this.handleSortClick(newSort)}
            >
              {column.label}
            </TableSortLabel>
          </Tooltip>
        </TableCell>
      );
    }
    return (
      <TableCell key={index} {...column.CellProps}>
        {column.label}
      </TableCell>
    );
  };

  public tableBodyRow = (row: any, index: number) => {
    const { columns, selectable, rowActions, classes } = this.props;
    const { selected } = this.state;
    return (
      <TableRow key={index} className={classes.tableBodyRow}>
        {selectable && (
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              checked={selected.indexOf(index) > -1}
              onClick={this.handleSelectClick(index)}
            />
          </TableCell>
        )}
        {columns.map(this.tableBodyCell(row, index))}
        {rowActions && rowActions.length && (
          <TableCell className={classes.tableActionCell} padding="none">
            <div className={classes.tableRowActions}>
              {rowActions.map(this.tableRowAction(row, index))}
            </div>
          </TableCell>
        )}
      </TableRow>
    );
  };

  public tableBodyCell = (row: any, rowIndex: number) => (
    col: EnhancedTableColumn,
    colIndex: number
  ) => {
    return (
      <TableCell key={`${rowIndex}_${colIndex}`} {...col.CellProps}>
        {this.parseCellValue(row, col, col.value)}
      </TableCell>
    );
  };

  public tableRowAction = (row: any, rowIndex: number) => (
    action: EnhancedTableRowAction,
    actionIndex: number
  ) => {
    const { classes } = this.props;
    return (
      <Tooltip
        placement="bottom-end"
        title={action.title}
        key={`${rowIndex}_${actionIndex}`}
      >
        {action.link ? (
          <div>
            <IconButtonLink
              to={action.link(row)}
              className={classes.tableRowAction}
            >
              {action.icon}
            </IconButtonLink>
          </div>
        ) : (
          <IconButton
            className={classes.tableRowAction}
            onClick={action.onClick && action.onClick(row)}
          >
            {action.icon}
          </IconButton>
        )}
      </Tooltip>
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

    if (this.props.cellRenderer) {
      return this.props.cellRenderer(row, column, value);
    }
    return value;
  };

  public tableFooter = () => {
    return <TableFooter />;
  };

  public render() {
    const { data, columns, selectable, rowActions } = this.props;
    const classes = this.props.classes!;
    const tableHead = this.tableHead();
    const tableFooter = this.tableFooter();
    return (
      <Paper className={classes.root} elevation={0}>
        <Table className={classes.paper}>
          {tableHead}
          <TableBody>
            {data ? (
              data.map(this.tableBodyRow)
            ) : (
              <ContentLoading
                type="table"
                rows={20}
                columns={
                  columns.length +
                  (selectable ? 1 : 0) +
                  (rowActions && rowActions.length ? 1 : 0)
                }
              />
            )}
          </TableBody>
          {tableFooter}
        </Table>
      </Paper>
    );
  }
}

export default withStyles(styles)(EnhancedTable);
