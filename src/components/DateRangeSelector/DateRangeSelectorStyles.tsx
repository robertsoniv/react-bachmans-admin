import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) => {
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
      border: "1px solid " + theme.palette.grey[300],
      backgroundColor: theme.palette.grey[200],
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
      },
      "& .DateInput": {
        ...theme.typography.body1,
        flex: "1 0 auto",
        width: 75,
        backgroundColor: "transparent"
      },

      "& .DateRangePickerInput": {
        display: "flex",
        flexFlow: "row nowrap",
        padding: 0,
        alignItems: "center",
        backgroundColor: "transparent"
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
      padding: theme.spacing.unit
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
      padding: 1,
      border: "none"
    },
    dayButton: {
      display: "table-cell",
      flex: "none",
      fontSize: 16,
      width: 39,
      height: 39,
      padding: 1,
      minWidth: 0
    },
    dayToday: {
      border: "1px solid " + theme.palette.secondary.light,
      fontWeight: theme.typography.fontWeightMedium
    },
    dayDisabled: {
      color: theme.palette.grey[500]
    },
    dayHover: {
      backgroundColor: theme.palette.grey[200]
    },
    daySpanSelected: {
      color: theme.palette.secondary.contrastText,
      backgroundColor: theme.palette.secondary.light,
      border: "none"
    },
    daySpanStartEnd: {
      color: theme.palette.secondary.contrastText,
      backgroundColor: theme.palette.secondary.main,
      border: "none"
    }
  });
};
