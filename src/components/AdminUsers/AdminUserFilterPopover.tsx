import React from "react";
import {
  IconButton,
  withStyles,
  Theme,
  createStyles,
  Popover,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Grid,
  TextField,
  Paper,
  Badge,
  Tooltip,
  Divider,
  Button
} from "@material-ui/core";
import { FilterList } from "@material-ui/icons";
import { AdminUserListOptions } from "./AdminUserList";
import { Address } from "ordercloud-javascript-sdk";

const styles = (theme: Theme) =>
  createStyles({
    iconButton: {
      padding: 10
    },
    popover: {
      padding: theme.spacing.unit * 2,
      width: 400,
      maxWidth: "100%"
    },
    spacer: {
      width: theme.spacing.unit
    },
    buttons: {
      textAlign: "right"
    },
    button: {
      "&:not(:last-child)": {
        marginRight: theme.spacing.unit
      }
    }
  });

interface AdminUserFilterPopoverProps {
  classes: any;
  stores?: Address[];
  options: AdminUserListOptions;
  onChange: (newFilters: any) => void;
}

class AdminUserFilterPopover extends React.Component<
  AdminUserFilterPopoverProps
> {
  get activeFilters() {
    let activeFilters = 0;
    Object.values(this.state).forEach(val => {
      if (typeof val === "string" && val.length) {
        activeFilters++;
      }
    });
    return activeFilters;
  }

  get initialProps() {
    return {
      activeFilters: Object.values(this.props.options).length,
      status: this.props.options.status || "",
      store: this.props.options.store || "",
      role: this.props.options.role || ""
    };
  }

  public state = {
    open: false,
    ...this.initialProps
  };

  public anchorEl: any;

  public handleClick = (event: React.MouseEvent) => {
    this.setState({
      open: true
    });
  };

  public handleCancelClick = (event: React.MouseEvent) => {
    this.setState({
      open: false,
      ...this.initialProps
    });
  };

  public handleApplyClick = (event: React.SyntheticEvent<{}, Event>) => {
    this.setState({ open: false, activeFilters: this.activeFilters });
    this.props.onChange({
      store: this.state.store,
      role: this.state.role,
      status: this.state.status
    });
  };

  public handleChange = (field: string) => (
    event: React.ChangeEvent<{}>,
    value: string
  ) => {
    this.setState({ [field]: value });
  };

  public handleStoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ store: event.target.value });
  };

  public render() {
    const { classes, stores } = this.props;
    const { open, status, store, activeFilters } = this.state;
    return (
      <React.Fragment>
        <IconButton
          title="Filter Users"
          onClick={this.handleClick}
          buttonRef={node => {
            this.anchorEl = node;
          }}
          className={classes.iconButton}
        >
          <Badge color="secondary" badgeContent={activeFilters}>
            <FilterList />
          </Badge>
        </IconButton>
        <Popover
          open={open}
          anchorEl={this.anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left"
          }}
        >
          <Paper className={classes.popover}>
            <FormLabel>Filter By:</FormLabel>
            <Grid container>
              <Grid item sm={4}>
                <RadioGroup
                  aria-label="Status"
                  className={classes.group}
                  value={status}
                  onChange={this.handleChange("status")}
                >
                  <FormControlLabel
                    value=""
                    control={<Radio />}
                    label="All Users"
                  />
                  <FormControlLabel
                    value="active"
                    control={<Radio />}
                    label="Active"
                  />
                  <FormControlLabel
                    value="inactive"
                    control={<Radio />}
                    label="Inactive"
                  />
                </RadioGroup>
              </Grid>
              <Grid item sm={8}>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  label="Store"
                  select
                  value={store}
                  onChange={this.handleStoreChange}
                >
                  <MenuItem value="">All Stores</MenuItem>

                  {stores &&
                    stores.map(store => (
                      <MenuItem key={store.ID} value={store.ID}>
                        {store.CompanyName}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
            </Grid>
            <div className={classes.buttons}>
              <Button
                size="small"
                onClick={this.handleCancelClick}
                className={classes.button}
              >
                Cancel
              </Button>
              <Button
                size="small"
                onClick={this.handleApplyClick}
                color="primary"
                className={classes.button}
                variant="contained"
              >
                Apply
              </Button>
            </div>
          </Paper>
        </Popover>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(AdminUserFilterPopover);
