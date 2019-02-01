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

interface SearchFieldProps {
  onSearch: (newParams: Object) => void;
  placeholder?: string;
  value: string;
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      border: "1px solid " + theme.palette.grey[300],
      backgroundColor: theme.palette.grey[200],
      padding: "2px 4px",
      maxWidth: 500,
      marginRight: theme.spacing.unit,
      display: "flex",
      alignItems: "center",
      transition: theme.transitions.create(
        ["box-shadow", "background-color", "border-color"],
        {
          duration: theme.transitions.duration.short,
          easing: theme.transitions.easing.sharp
        }
      ),
      "&:focus-within": {
        borderColor: "transparent",
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[3]
      }
    },
    input: {
      flexGrow: 1
    },
    iconButton: {
      padding: theme.spacing.unit
    }
  });

class SearchField extends React.Component<
  SearchFieldProps,
  { searchTerm?: string }
> {
  constructor(props: SearchFieldProps) {
    super(props);
  }

  componentDidMount = () => {
    this.setState({ searchTerm: this.props.value || "" });
  };

  componentDidUpdate = (prevProps: SearchFieldProps) => {
    if (this.props.value !== prevProps.value) {
      this.setState({ searchTerm: this.props.value || "" });
    }
  };

  public onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: event.target.value });
  };

  public handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    this.props.onSearch({ search: this.state.searchTerm });
  };

  public handleClear = (event: React.MouseEvent) => {
    this.setState({ searchTerm: "" });
    this.props.onSearch({ search: "" });
  };

  public render() {
    const { classes, placeholder } = this.props;
    return (
      this.state && (
        <form onSubmit={this.handleSearch}>
          <Paper className={classes.root} elevation={0}>
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
              placeholder={placeholder || "Search"}
              onChange={this.onChange}
              value={this.state.searchTerm}
            />
            {this.props.value && (
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

export default withStyles(styles)(SearchField);
