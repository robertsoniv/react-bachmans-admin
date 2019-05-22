import {
  Badge,
  Button,
  createStyles,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Paper,
  Popover,
  Radio,
  RadioGroup,
  Theme,
  withStyles,
  TextField,
  MenuItem
} from "@material-ui/core";
import { FilterList } from "@material-ui/icons";
import { pick } from "lodash";
import React from "react";
import { CustomerListOptions } from "./CustomerList";
import OcDateRange, {
  DateRangeChangeEvent
} from "../Shared/OcDateRange/OcDateRange";
import { UserGroups, UserGroup } from "ordercloud-javascript-sdk";

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
    popoverPaper: {
      overflow: "visible"
    },
    spacer: {
      width: theme.spacing.unit
    },
    buttons: {
      marginTop: theme.spacing.unit * 2,
      textAlign: "right"
    },
    button: {
      "&:not(:last-child)": {
        marginRight: theme.spacing.unit
      }
    }
  });

const ADMIN_USER_FILTER_FIELDS = {
  status: "",
  login: "",
  synced: "",
  group: "",
  ecn: ""
};

interface CustomerFilterPopoverProps {
  classes: any;
  options: CustomerListOptions;
  onChange: (newFilters: any) => void;
}

class CustomerFilterPopover extends React.Component<
  CustomerFilterPopoverProps
> {
  get activeFilters() {
    const options = pick(this.state, Object.keys(ADMIN_USER_FILTER_FIELDS));
    return Object.values(options).filter(s => (s as string).length).length;
  }

  get initialProps() {
    const options = pick(
      this.props.options,
      Object.keys(ADMIN_USER_FILTER_FIELDS)
    );
    return {
      activeFilters: Object.values(options).length,
      ...ADMIN_USER_FILTER_FIELDS,
      ...options
    };
  }

  public state = {
    open: false,
    groups: [],
    ...this.initialProps
  };

  public componentDidMount = () => {
    UserGroups.List("Bachmans", { pageSize: 100 }).then(list => {
      this.setState({
        groups: list.Items!.filter(
          g => g.xp && (g.xp.IsCommGroup || g.xp.IsBachmansGroup)
        )
      });
    });
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
    this.props.onChange(
      pick(this.state, Object.keys(ADMIN_USER_FILTER_FIELDS))
    );
  };

  public handleStatusChange = (event: React.ChangeEvent<{}>, value: string) => {
    this.setState({ status: value });
  };

  public handleGroupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ group: event.target.value });
  };

  public handleChange = (field: string) => (
    event: React.ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    this.setState({ [field]: event.target.value });
  };

  public render() {
    const { classes } = this.props;
    const {
      open,
      status,
      login,
      synced,
      group,
      ecn,
      groups,
      activeFilters
    } = this.state;
    return (
      <React.Fragment>
        <IconButton
          title="Filter Customers"
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
          classes={{
            paper: classes.popoverPaper
          }}
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
              <Grid item sm={5}>
                <RadioGroup
                  aria-label="Status"
                  className={classes.group}
                  value={status}
                  onChange={this.handleStatusChange}
                >
                  <FormControlLabel
                    value=""
                    control={<Radio />}
                    label="All Customers"
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
              <Grid item sm={7}>
                <TextField
                  fullWidth
                  id="eagleCustomerNumber"
                  margin="dense"
                  variant="outlined"
                  label="Eagle Customer Number"
                  onChange={this.handleChange("ecn")}
                  value={ecn}
                />
                <TextField
                  fullWidth
                  id="customerGroup"
                  variant="outlined"
                  margin="dense"
                  label="Customer Group"
                  select
                  value={group}
                  onChange={this.handleGroupChange}
                >
                  <MenuItem value="">All Groups</MenuItem>
                  {groups &&
                    groups.map((group: UserGroup) => (
                      <MenuItem key={group.ID} value={group.ID}>
                        {group.Name}
                      </MenuItem>
                    ))}
                </TextField>
                <TextField
                  fullWidth
                  id="lastLoggedIn"
                  margin="dense"
                  variant="outlined"
                  label="Hasn't logged in since"
                  type="date"
                  InputLabelProps={{
                    shrink: true
                  }}
                  onChange={this.handleChange("login")}
                  value={login}
                />
                <TextField
                  fullWidth
                  id="lastSynced"
                  margin="dense"
                  variant="outlined"
                  label="Hasn't been synced since"
                  type="date"
                  InputLabelProps={{
                    shrink: true
                  }}
                  onChange={this.handleChange("synced")}
                  value={synced}
                />
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

export default withStyles(styles)(CustomerFilterPopover);
