import { createMuiTheme } from "@material-ui/core/styles";

const defaultTheme = createMuiTheme();

export default createMuiTheme({
  palette: {
    primary: {
      main: "#8c58b5",
      contrastText: "#fff"
    },
    secondary: {
      main: "#95a83b",
      contrastText: "#fff"
    }
  },
  typography: {
    useNextVariants: true
  },
  overrides: {
    MuiOutlinedInput: {
      root: {
        background: "#fff"
      },
      notchedOutline: {
        zIndex: 1
      },
      adornedStart: {
        paddingLeft: defaultTheme.spacing.unit
      },
      adornedEnd: {
        paddingRight: defaultTheme.spacing.unit
      },
      input: {
        padding: `${defaultTheme.spacing.unit * 1.5}px ${defaultTheme.spacing
          .unit * 1.5}px`
      }
    }
  }
});
