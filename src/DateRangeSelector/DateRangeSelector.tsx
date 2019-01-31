import React from "react";
import {
  IconButton,
  Theme,
  createStyles,
  withStyles,
  Paper,
  ButtonBase,
  TableCell,
  Typography
} from "@material-ui/core";

import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";

import { DateRangePicker } from "react-dates";
import moment, { Moment } from "moment";
import classNames from "classnames";

import CalendarIcon from "@material-ui/icons/EventNoteOutlined";
import ArrowRightIcon from "@material-ui/icons/ArrowForward";
import ClearIcon from "@material-ui/icons/Close";
import NavNextIcon from "@material-ui/icons/NavigateNext";
import NavPrevIcon from "@material-ui/icons/NavigateBefore";

const styles = (theme: Theme) => {
  var light = theme.palette.type === "light";
  var placeholder = {
    color: "currentColor",
    opacity: light ? 0.42 : 0.5,
    transition: theme.transitions.create("opacity", {
      duration: theme.transitions.duration.shorter
    })
  };
  return createStyles({
    root: {
      padding: "2px 4px",
      "& .DateInput": {
        ...theme.typography.body1,
        flex: "1 0 auto",
        width: 75
      },

      "& .DateRangePickerInput": {
        display: "flex",
        flexFlow: "row nowrap",
        padding: 0,
        alignItems: "center"
      },
      "& .DateRangePickerInput_clearDates": {
        margin: 0,
        padding: 0,
        flex: 0,
        position: "static",
        top: "auto",
        right: "auto",
        transform: "none"
      },
      "& .DateRangePickerInput_calendarIcon": {
        margin: 0,
        padding: 0,
        flex: 0
      },
      "& .DateInput_input": {
        ...theme.typography.body1,
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
        fontSize: theme.typography.pxToRem(16),
        lineHeight: "1.1875em",
        // Reset (19px), match the native input line-height
        display: "inline-flex",
        alignItems: "center",
        "&$disabled": {
          color: theme.palette.text.disabled,
          cursor: "default"
        },
        letterSpacing: "normal",
        margin: 0,
        border: 0,
        padding: "6px 0 7px",
        background: "transparent",
        // Fix IE 11 width issue
        "&::-webkit-input-placeholder": placeholder,
        "&::-moz-placeholder": placeholder,
        // Firefox 19+
        "&:-ms-input-placeholder": placeholder,
        // IE 11
        "&::-ms-input-placeholder": placeholder
      },
      "& .DateRangePicker_picker": {
        left: `${-4}px !important`
      },
      "& .DayPicker__withBorder": {
        boxShadow: theme.shadows[2]
      }
    },
    iconButton: {
      padding: 10
    },
    customArrowIcon: {
      fontSize: 16,
      width: 44,
      marginTop: theme.spacing.unit / 2,
      color: "rgba(0,0,0,0.4)"
    },
    navPrevButton: {
      position: "absolute",
      left: theme.spacing.unit,
      top: theme.spacing.unit
    },
    navNextButton: {
      position: "absolute",
      right: theme.spacing.unit,
      top: theme.spacing.unit
    },
    monthText: {
      fontWeight: theme.typography.fontWeightMedium
    },
    emptyCell: {
      width: 39,
      height: 39,
      padding: 0,
      border: "none"
    },
    dayButton: {
      display: "table-cell",
      flex: "none",
      fontSize: 16,
      width: 39,
      height: 39,
      padding: 0,
      minWidth: 0
    },
    dayToday: {
      border: "1px solid " + theme.palette.primary.light,
      fontWeight: theme.typography.fontWeightMedium
    },
    dayDisabled: {
      color: theme.palette.grey[500]
    },
    dayHover: {
      backgroundColor: theme.palette.secondary.main
    },
    daySpanSelected: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.light,
      border: "none"
    },
    daySpanStartEnd: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
      border: "none"
    }
  });
};

interface DateRangeProps {
  startDate: Moment | null;
  endDate: Moment | null;
}

interface DateRangeSelectorProps {
  startDate: string | null;
  endDate: string | null;
  numberOfMonths?: number;
  onChange: (newParams: Object) => void;
  format: string;
  classes: any;
  theme: Theme;
}
interface DateRangeSelectorState extends DateRangeProps {
  focusedInput: any;
}

class DateRangeSelector extends React.Component<
  DateRangeSelectorProps,
  DateRangeSelectorState
> {
  componentDidMount = () => {
    this.setState(this.parseDateProps());
  };

  componentDidUpdate = ({ startDate, endDate }: DateRangeSelectorProps) => {
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
      from: startDate ? startDate.format(this.props.format) : null,
      to: endDate ? endDate.format(this.props.format) : null
    });
  };

  public onMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
  };

  public isOutsideRange = (day: any) => {
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

  public onKeyDown = (day: any) => (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      day.onDayClick(day.day, event);
    }
  };

  public renderCalendarDay = (day: any) => {
    const { classes } = this.props;
    const dayClasses: any = {
      [classes.dayButton]: true
    };
    if (day && day.modifiers) {
      dayClasses[classes.dayToday] = day.modifiers.has("today");
      dayClasses[classes.dayDisabled] = day.modifiers.has("blocked");
      dayClasses[classes.dayHover] =
        day.modifiers.has("hovered-span") || day.modifiers.has("hovered");
      dayClasses[classes.daySpanSelected] = day.modifiers.has("selected-span");
      dayClasses[classes.daySpanStartEnd] =
        day.modifiers.has("selected-start") ||
        day.modifiers.has("selected-end");
    }

    return day && day.day ? (
      <ButtonBase
        disabled={day.modifiers && day.modifiers.has("blocked")}
        onClick={() => day.onDayClick(day.day)}
        onMouseEnter={() => day.onDayMouseEnter(day.day)}
        onMouseLeave={() => day.onDayMouseLeave(day.day)}
        onKeyDown={this.onKeyDown(day)}
        onMouseUp={this.onMouseUp}
        component="td"
        tabIndex={-1}
        className={classNames(dayClasses)}
        key={day.key}
      >
        {day.renderDayContents(day.day)}
      </ButtonBase>
    ) : (
      <TableCell className={classes.emptyCell} key={day.key} />
    );
  };

  public renderDayContents = (day: Moment) => {
    return day.date().toString();
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
    const { classes, theme } = this.props;
    return (
      this.state && (
        <Paper className={classes.root} elevation={1}>
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
            renderCalendarDay={this.renderCalendarDay}
            renderDayContents={this.renderDayContents}
            renderMonthText={this.renderMonthText}
            startDatePlaceholderText="From Date"
            endDatePlaceholderText="To Date"
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

export default withStyles(styles, { withTheme: true })(DateRangeSelector);
