import { createMuiTheme } from "@material-ui/core/styles";

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
  }
});
