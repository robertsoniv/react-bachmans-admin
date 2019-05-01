import {
  withStyles,
  Theme,
  createStyles,
  TableRow,
  TableCell
} from "@material-ui/core";
import React from "react";

const loadingStyles = (theme: Theme) =>
  createStyles({
    container: {
      display: "block",
      width: "100%"
    },
    placeholder: {
      height: theme.spacing.unit * 5,
      borderRadius: theme.shape.borderRadius,
      background: theme.palette.grey[200],
      width: "100%",
      display: "block",
      marginBottom: theme.spacing.unit
    },
    tableContainer: {
      padding: theme.spacing.unit
    },
    tablePlaceholder: {
      height: theme.spacing.unit * 5,
      borderRadius: theme.shape.borderRadius,
      background: theme.palette.grey[200],
      width: "100%",
      display: "block",
      "&:not(:last-of-type)": {
        marginBottom: theme.spacing.unit
      }
    }
  });

const ContentLoading: React.FunctionComponent<any> = (props: any) => {
  const { classes, type, rows, columns, height, width } = props;
  const rowArray = [];
  for (let i = 0; i < rows; i++) {
    rowArray.push(0);
  }

  switch (type) {
    case "table":
      return (
        <React.Fragment>
          {rowArray.map((r, ri) => (
            <TableRow key={ri}>
              <TableCell colSpan={columns}>
                <div className={classes.tablePlaceholder} style={{ height }} />
              </TableCell>
            </TableRow>
          ))}
        </React.Fragment>
      );
    default:
      return (
        <div className={classes.container}>
          <div style={{ width }}>
            {rowArray.map((r, i) => (
              <div key={i} className={classes.placeholder} style={{ height }} />
            ))}
          </div>
        </div>
      );
  }
};

export default withStyles(loadingStyles)(ContentLoading);
