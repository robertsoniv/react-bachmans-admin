import React, { ReactElement } from "react";
import { Route } from "react-router";
import { Link } from "react-router-dom";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Theme,
  createStyles,
  withStyles
} from "@material-ui/core";
import { IconProps } from "@material-ui/core/Icon";

/**
 * A <Link> wrapper that knows if it's "active" or not.
 */
const style = (theme: Theme) =>
  createStyles({
    activeIcon: {
      color: theme.palette.primary.main
    }
  });

class ListItemNavLink extends React.Component<{
  icon: ReactElement<IconProps>;
  activeIcon: ReactElement<IconProps>;
  primary?: string;
  secondary?: string;
  to: string;
  exact?: boolean;
  strict?: boolean;
  classes: any;
}> {
  renderLink = (props: any) => <Link {...props} to={this.props.to} />;
  public render() {
    const { classes } = this.props;
    const path = this.props.to;

    // Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L202
    const escapedPath =
      path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
    return (
      <Route
        path={escapedPath}
        exact={this.props.exact}
        strict={this.props.strict}
        children={({ match }) => {
          const isActive = !!match;

          return (
            <ListItem button component={this.renderLink}>
              <ListItemIcon className={isActive ? classes.activeIcon : null}>
                {isActive ? this.props.activeIcon : this.props.icon}
              </ListItemIcon>
              <ListItemText
                primary={this.props.primary}
                secondary={this.props.secondary}
              />
            </ListItem>
          );
        }}
      />
    );
  }
}

export default withStyles(style)(ListItemNavLink);
