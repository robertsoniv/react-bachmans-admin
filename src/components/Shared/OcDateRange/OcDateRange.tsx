import React from "react";
import {
  IconButton,
  Theme,
  withStyles,
  Paper,
  Typography
} from "@material-ui/core";

import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";

import { DateRangePicker } from "react-dates";
import moment, { Moment } from "moment";

import CalendarIcon from "@material-ui/icons/EventNoteOutlined";
import ArrowRightIcon from "@material-ui/icons/ArrowForward";
import ClearIcon from "@material-ui/icons/Close";
import NavNextIcon from "@material-ui/icons/NavigateNext";
import NavPrevIcon from "@material-ui/icons/NavigateBefore";

import styles from "./OcDateRangeStyles";

interface DateRangeProps {
  startDate: Moment | null;
  endDate: Moment | null;
}

export interface DateRangeChangeEvent {
  from: string;
  to: string;
}

interface OcDateRangeProps {
  startDate: string | null;
  endDate: string | null;
  numberOfMonths?: number;
  onChange: (dates: DateRangeChangeEvent) => void;
  format: string;
  classes: any;
  theme: Theme;
  allDates?: boolean;
  fromLabel?: string;
  toLabel?: string;
}
interface OcDateRangeState extends DateRangeProps {
  focusedInput: any;
}

class OcDateRange extends React.Component<OcDateRangeProps, OcDateRangeState> {
  componentDidMount = () => {
    this.setState(this.parseDateProps());
  };

  componentDidUpdate = ({ startDate, endDate }: OcDateRangeProps) => {
    if (this.props.startDate !== startDate || this.props.endDate !== endDate) {
      this.setState(this.parseDateProps());
    }
  };

  public parseDateProps = () => {
    return {
      startDate: this.props.startDate
        ? moment(this.props.startDate, this.props.format)
        : null,
      endDate: this.props.endDate
        ? moment(this.props.endDate, this.props.format)
        : null
    };
  };

  public handleDatesChange = ({ startDate, endDate }: DateRangeProps) => {
    this.props.onChange({
      from: startDate ? startDate.startOf("d").format(this.props.format) : "",
      to: endDate ? endDate.endOf("d").format(this.props.format) : ""
    });
  };

  public onMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
  };

  public isOutsideRange = (day: any) => {
    if (this.props.allDates) {
      return false;
    }
    return (
      day &&
      typeof day.isAfter === "function" &&
      day.isAfter(moment().endOf("d"))
    );
  };

  public initialMonth = () => {
    const offset = this.props.numberOfMonths || 2;
    return (
      this.state.startDate ||
      moment()
        .subtract(offset - 1, "M")
        .startOf("M")
    );
  };

  public onFocusChange = (focusedInput: any) => {
    this.setState({ focusedInput });
  };

  public renderMonthText = (day: Moment) => {
    const { monthText } = this.props.classes;
    return (
      <Typography variant="body1" className={monthText}>
        {day.format("MMMM YYYY")}
      </Typography>
    );
  };

  public render() {
    const { classes, theme, fromLabel, toLabel } = this.props;
    return (
      this.state && (
        <Paper className={classes.root} elevation={0}>
          <DateRangePicker
            verticalSpacing={6}
            horizontalMargin={theme.spacing.unit * 2}
            startDateId="startDate"
            endDateId="endDate"
            isOutsideRange={this.isOutsideRange}
            initialVisibleMonth={this.initialMonth}
            focusedInput={this.state.focusedInput}
            onDatesChange={this.handleDatesChange}
            onFocusChange={this.onFocusChange}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            renderMonthText={this.renderMonthText}
            startDatePlaceholderText={fromLabel || "From Date"}
            endDatePlaceholderText={toLabel || "To Date"}
            displayFormat="M/D/YY"
            minimumNights={0}
            numberOfMonths={this.props.numberOfMonths || 2}
            hideKeyboardShortcutsPanel={true}
            showClearDates={true}
            noBorder={true}
            customInputIcon={
              <IconButton
                component="span"
                color="primary"
                className={classes.iconButton}
              >
                <CalendarIcon />
              </IconButton>
            }
            customArrowIcon={
              <ArrowRightIcon className={classes.customArrowIcon} />
            }
            customCloseIcon={
              <IconButton component="span" className={classes.iconButton}>
                <ClearIcon />
              </IconButton>
            }
            navPrev={
              <IconButton
                component="span"
                className={`${classes.iconButton} ${classes.navPrevButton}`}
              >
                <NavPrevIcon />
              </IconButton>
            }
            navNext={
              <IconButton
                component="span"
                className={`${classes.iconButton} ${classes.navNextButton}`}
              >
                <NavNextIcon />
              </IconButton>
            }
          />
        </Paper>
      )
    );
  }
}

export default withStyles(styles, { withTheme: true })(OcDateRange);
