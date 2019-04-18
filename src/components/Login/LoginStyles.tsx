import { createStyles, Theme } from "@material-ui/core";
import { fade } from "@material-ui/core/styles/colorManipulator";

const LoginStyles = (theme: Theme) =>
  createStyles({
    root: {
      flex: "1 1 auto",
      textAlign: "center",
      padding: theme.spacing.unit,
      boxSizing: "border-box"
    },

    error: {
      backgroundColor: theme.palette.error.dark
    },
    form: {
      marginTop: theme.spacing.unit * 10,
      marginLeft: "auto",
      marginRight: "auto",
      maxWidth: 300,
      padding: theme.spacing.unit * 3,
      borderRadius: theme.shape.borderRadius,
      transition: "background-color 200ms ease-in-out",
      backgroundColor: fade(theme.palette.background.paper, 0.6),
      boxShadow: theme.shadows[5],
      "&:hover, &:focus-within": {
        backgroundColor: fade(theme.palette.background.paper, 1)
      }
    },
    logo: {
      maxWidth: "80%"
    },
    textFields: {
      width: "100%",
      marginBottom: theme.spacing.unit * 2
    },
    loginButton: {
      background:
        "linear-gradient(45deg, " +
        theme.palette.primary.dark +
        " 30%, " +
        theme.palette.primary.light +
        " 90%)",
      width: "100%",
      marginTop: theme.spacing.unit * 1
    }
  });

export default LoginStyles;
