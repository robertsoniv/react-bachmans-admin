import React from "react";
import {
  InputBase,
  Paper,
  Theme,
  createStyles,
  withStyles,
  IconButton
} from "@material-ui/core";

import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Close";

interface OrderSearchProps {
  onSearch: (searchTerm?: string) => void;
  value: string;
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: "2px 4px",
      maxWidth: 500,
      marginRight: theme.spacing.unit * 2,
      display: "flex",
      alignItems: "center"
    },
    input: {
      flexGrow: 1
    },
    iconButton: {
      padding: 10
    }
  });

class OrderSearch extends React.Component<
  OrderSearchProps,
  { searchTerm?: string }
> {
  constructor(props: OrderSearchProps) {
    super(props);
  }

  componentDidMount = () => {
    this.setState({ searchTerm: this.props.value || "" });
  };

  componentDidUpdate = (prevProps: OrderSearchProps) => {
    if (this.props.value !== prevProps.value) {
      this.setState({ searchTerm: this.props.value || "" });
    }
  };

  public onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: event.target.value });
  };

  public handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    this.props.onSearch(this.state.searchTerm);
  };

  public handleClear = (event: React.MouseEvent) => {
    this.setState({ searchTerm: "" });
    this.props.onSearch();
  };

  public render() {
    const { classes } = this.props;
    return (
      this.state && (
        <form onSubmit={this.handleSearch}>
          <Paper className={classes.root} elevation={1}>
            <IconButton
              type="submit"
              color="primary"
              className={classes.iconButton}
              aria-label="Search"
            >
              <SearchIcon />
            </IconButton>
            <InputBase
              className={classes.input}
              placeholder="Search"
              onChange={this.onChange}
              value={this.state.searchTerm}
            />
            {this.state.searchTerm && (
              <IconButton
                onClick={this.handleClear}
                className={classes.iconButton}
                aria-label="Clear search"
              >
                <ClearIcon />
              </IconButton>
            )}
          </Paper>
        </form>
      )
    );
  }
}

export default withStyles(styles)(OrderSearch);
