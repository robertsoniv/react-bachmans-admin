import React from "react";
import {
  TextField,
  IconButton,
  withStyles,
  Theme,
  createStyles
} from "@material-ui/core";
import { Search, Clear } from "@material-ui/icons";

interface OcSearchProps {
  classes: any;
  placeholder: string;
  value: string;
  onChange: (searchTerm: string) => void;
}

interface OcSearchState {
  searchTerm: string;
}

const styles = (theme: Theme) =>
  createStyles({
    iconButton: {
      padding: theme.spacing.unit / 1.5
    }
  });

class OcSearch extends React.Component<OcSearchProps, OcSearchState> {
  componentDidMount = () => {
    this.setState({ searchTerm: this.props.value });
  };

  componentDidUpdate = (prevProps: OcSearchProps) => {
    if (this.props.value !== prevProps.value) {
      this.setState({ searchTerm: this.props.value });
    }
  };

  public onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: event.target.value });
  };

  public handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    this.props.onChange(this.state.searchTerm);
  };

  public handleClear = (event: React.MouseEvent) => {
    this.setState({ searchTerm: "" });
    this.props.onChange("");
  };

  public render() {
    const { classes, placeholder } = this.props;
    return (
      this.state && (
        <form onSubmit={this.handleSearch}>
          <TextField
            title={placeholder || "Search"}
            variant="outlined"
            placeholder={placeholder || "Search"}
            onChange={this.onChange}
            value={this.state.searchTerm}
            InputProps={{
              classes: {
                adornedStart: classes.adornedStart,
                adornedEnd: classes.adornedEnd
              },
              startAdornment: (
                <IconButton
                  type="submit"
                  color="primary"
                  className={classes.iconButton}
                  aria-label="Search"
                >
                  <Search />
                </IconButton>
              ),
              endAdornment: this.state.searchTerm && (
                <IconButton
                  className={classes.iconButton}
                  onClick={this.handleClear}
                  aria-label="Clear search"
                >
                  <Clear />
                </IconButton>
              )
            }}
          />
        </form>
      )
    );
  }
}

export default withStyles(styles)(OcSearch);
