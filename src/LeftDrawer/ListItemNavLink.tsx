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

interface ListItemNavLinkProps {
  icon: ReactElement<IconProps>;
  activeIcon: ReactElement<IconProps>;
  primary?: string;
  secondary?: string;
  to: string;
  exact?: boolean;
  strict?: boolean;
  classes: any;
}

class ListItemNavLink extends React.Component<ListItemNavLinkProps> {
  public renderLink = (listItemProps: any) => (
    <Link {...listItemProps} to={this.props.to} />
  );

  public render() {
    const {
      classes,
      strict,
      exact,
      activeIcon,
      icon,
      primary,
      secondary
    } = this.props;
    const path = this.props.to;

    // Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L202
    const escapedPath =
      path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
    return (
      <Route
        path={escapedPath}
        exact={exact}
        strict={strict}
        children={({ match }) => {
          const isActive = !!match;

          return (
            <ListItem button component={this.renderLink}>
              <ListItemIcon className={isActive ? classes.activeIcon : null}>
                {isActive ? activeIcon : icon}
              </ListItemIcon>
              <ListItemText primary={primary} secondary={secondary} />
            </ListItem>
          );
        }}
      />
    );
  }
}

export default withStyles(style)(ListItemNavLink);
