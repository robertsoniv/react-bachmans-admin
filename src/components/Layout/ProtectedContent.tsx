import React from "react";
import { AppContext } from "../../App.context";

interface ProtectedContentProps {
  hasAccess: (permissions: string[]) => boolean;
}

class ProtectedContent extends React.PureComponent<ProtectedContentProps> {
  public render() {
    const { hasAccess } = this.props;
    return (
      <AppContext.Consumer>
        {context => {
          if (
            context &&
            context.permissions &&
            context.permissions.length &&
            hasAccess(context.permissions)
          ) {
            return this.props.children;
          } else {
            return "";
          }
        }}
      </AppContext.Consumer>
    );
  }
}

export default ProtectedContent;
