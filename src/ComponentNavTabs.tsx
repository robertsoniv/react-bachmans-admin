import React from "react";
import { Tabs, Tab } from "@material-ui/core";
import ComponentRoutes from "./constants/Navigation.constants";

export interface ComponentNavTabsProps {
  baseUri: string;
  match: any;
  history: any;
}

export default class ComponentNavTabs extends React.Component<
  ComponentNavTabsProps
> {
  public handleChange = (event: any, value: string) => {
    this.props.history.push(value);
  };

  public render() {
    const { baseUri, match } = this.props;
    return (
      <Tabs
        value={match.path}
        indicatorColor="primary"
        onChange={this.handleChange}
      >
        {Object.entries(ComponentRoutes[baseUri].children).map(
          ([childPath, childComponent]: [string, any]) =>
            !childComponent.$ref && (
              <Tab
                key={baseUri + childPath}
                value={baseUri + childPath}
                label={childComponent.tabLabel || childComponent.label}
              />
            )
        )}
      </Tabs>
    );
  }
}
