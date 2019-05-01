import React from "react";
import { RouteComponentProps } from "react-router";

interface OcListProps<T> extends RouteComponentProps {
  service: any;
  routeParams?: string[];
  options?: any;
  onListChange?: (data: T) => void;
  onSelectionChange?: (selected: number[]) => void;
}

interface OcListState<T> {
  data: T;
}

class OcList<T> extends React.Component<OcListProps<T>, OcListState<T>> {
  public componentDidMount = () => {
    this.requestList();
  };

  public componentDidUpdate = (prevProps: OcListProps<T>) => {
    const { routeParams, options, location, match } = this.props;
    if (
      prevProps.routeParams !== routeParams ||
      prevProps.options !== options ||
      prevProps.location.search !== location.search ||
      prevProps.match !== match
    ) {
      console.log(this.props, prevProps);
      this.requestList();
    }
  };

  public handleSelectionChange = (selected: number[]) => {
    if (this.props.onSelectionChange) {
      this.props.onSelectionChange(selected);
    }
  };

  public requestList = () => {
    const { service, location, routeParams, options } = this.props;
    const sParams = new URLSearchParams(location.search);
    const qParams: any = {};
    const rParams = routeParams || [];
    sParams.forEach((value: any, key: string) => {
      qParams[key] = value;
    });
    const requestArgs = [...rParams, { ...qParams, ...options }];
    service.List.apply(service, requestArgs).then((data: T) => {
      this.setState({ data });
      if (this.props.onListChange) {
        this.props.onListChange(data);
      }
    });
  };
}

export default OcList;
