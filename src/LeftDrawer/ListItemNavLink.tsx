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

const ListItemNavLink: React.FunctionComponent<ListItemNavLinkProps> = (
  props: ListItemNavLinkProps
) => {
  const renderLink = (listItemProps: any) => (
    <Link {...listItemProps} to={props.to} />
  );
  const { classes } = props;
  const path = props.to;

  // Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L202
  const escapedPath = path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
  return (
    <Route
      path={escapedPath}
      exact={props.exact}
      strict={props.strict}
      children={({ match }) => {
        const isActive = !!match;

        return (
          <ListItem button component={renderLink}>
            <ListItemIcon className={isActive ? classes.activeIcon : null}>
              {isActive ? props.activeIcon : props.icon}
            </ListItemIcon>
            <ListItemText primary={props.primary} secondary={props.secondary} />
          </ListItem>
        );
      }}
    />
  );
};

export default withStyles(style)(ListItemNavLink);
