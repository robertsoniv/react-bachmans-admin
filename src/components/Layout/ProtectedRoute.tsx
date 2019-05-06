import React from "react";
import { RouteProps, Redirect, Route } from "react-router";
import { AppContext } from "../../App.context";

interface ProtectedRouteProps extends RouteProps {
  permission: string[];
}

const ProtectedRoute: React.FunctionComponent<ProtectedRouteProps> = (
  props: ProtectedRouteProps
) => {
  return (
    <AppContext.Consumer>
      {context => {
        if (context && context.permissions && context.permissions.length) {
          let hasPermission = false;
          props.permission.forEach(p => {
            if (context.permissions!.includes(p)) {
              hasPermission = true;
            }
          });
          if (hasPermission) {
            return <Route {...props} />;
          } else {
            return <Redirect to="/" />;
          }
        } else {
          return "";
        }
      }}
    </AppContext.Consumer>
  );
};

export default ProtectedRoute;
