import React from "react";
import {
  Typography,
  IconButton,
  TextField,
  withStyles,
  Theme,
  createStyles,
  Tooltip
} from "@material-ui/core";
import {
  NavigateBefore,
  NavigateNext,
  FirstPage,
  LastPage
} from "@material-ui/icons";
import MenuItem, { MenuItemProps } from "@material-ui/core/MenuItem";

export interface OcMetaData {
  Page: number;
  PageSize: number;
  TotalCount: number;
  TotalPages: number;
  ItemRange: number[];
}

interface OcPaginationProps {
  classes: any;
  meta: OcMetaData;
  location: any;
  history: any;
}

interface OcPaginationState {
  currentPage: number;
  currentPageSize: number;
  pageOptions: React.ReactElement<MenuItemProps>[];
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center"
    },
    typography: {
      marginRight: theme.spacing.unit
    },
    iconButton: {
      padding: 10
    }
  });

class OcPagination extends React.Component<
  OcPaginationProps,
  OcPaginationState
> {
  public timeout?: NodeJS.Timeout;

  public setPageOptions = () => {
    const { TotalPages } = this.props.meta;
    const pageOptions: React.ReactElement<MenuItemProps>[] = new Array();
    for (let i = 1; i <= TotalPages; i++) {
      pageOptions.push(
        <MenuItem key={i} value={i}>
          {i}
        </MenuItem>
      );
    }
    return pageOptions;
  };

  public state = {
    pageOptions: this.setPageOptions(),
    currentPage: this.props.meta.Page,
    currentPageSize: this.props.meta.PageSize
  };

  public componentDidMount = () => {
    this.setPageOptions();
  };

  public componentDidUpdate = (prevProps: OcPaginationProps) => {
    const { TotalPages, Page } = this.props.meta;
    let changed = false;
    const newState = Object.assign({}, this.state);
    if (TotalPages !== prevProps.meta.TotalPages) {
      changed = true;
      newState.pageOptions = this.setPageOptions();
    }
    if (Page !== prevProps.meta.Page && Page !== this.state.currentPage) {
      changed = true;
      newState.currentPage = Page;
    }
    if (changed) {
      this.setState(newState);
    }
  };

  public updateLocation = (newPage: number) => {
    const { location, history } = this.props;
    const params = new URLSearchParams(location.search);
    if (newPage > 1) {
      params.set("page", newPage.toString());
    } else {
      params.delete("page");
    }

    history.push({
      ...location,
      search: params.toString()
    });
  };

  public handlePagerClick = (page: number) => (event: React.MouseEvent) => {
    this.setState({ currentPage: page });
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.updateLocation(page);
    }, 300);
  };

  public handlePageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const page = Number(event.target.value);
    this.setState({ currentPage: page });
    this.updateLocation(page);
  };

  public handlePageSizeSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const pageSize = Number(event.target.value);
    this.setState({ currentPageSize: pageSize });

    const { location, history } = this.props;
    const params = new URLSearchParams(location.search);
    params.set("pageSize", pageSize.toString());

    history.push({
      ...location,
      search: params.toString()
    });
  };

  public render() {
    const { classes, meta } = this.props;
    const { currentPage, currentPageSize, pageOptions } = this.state;
    const { TotalCount, TotalPages, ItemRange } = meta;
    return (
      <div className={classes.root}>
        <Typography variant="body1" className={classes.typography}>
          {`${ItemRange[0]} - ${ItemRange[1]} of ${TotalCount}`}
        </Typography>
        <IconButton
          className={classes.iconButton}
          onClick={this.handlePagerClick(1)}
          disabled={currentPage === 1}
        >
          <FirstPage />
        </IconButton>
        <IconButton
          className={classes.iconButton}
          onClick={this.handlePagerClick(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <NavigateBefore />
        </IconButton>
        <TextField
          variant="outlined"
          select
          value={currentPage}
          onChange={this.handlePageSelect}
        >
          {pageOptions}
        </TextField>
        <IconButton
          className={classes.iconButton}
          onClick={this.handlePagerClick(currentPage + 1)}
          disabled={currentPage === TotalPages}
        >
          <NavigateNext />
        </IconButton>
        <IconButton
          className={classes.iconButton}
          onClick={this.handlePagerClick(TotalPages)}
          disabled={currentPage === TotalPages}
        >
          <LastPage />
        </IconButton>
        <TextField
          title="Page Size"
          variant="outlined"
          select
          value={currentPageSize}
          onChange={this.handlePageSizeSelect}
        >
          <MenuItem value="5">5</MenuItem>
          <MenuItem value="10">10</MenuItem>
          <MenuItem value="25">25</MenuItem>
          <MenuItem value="50">50</MenuItem>
          <MenuItem value="100">100</MenuItem>
        </TextField>
      </div>
    );
  }
}

export default withStyles(styles)(OcPagination);
