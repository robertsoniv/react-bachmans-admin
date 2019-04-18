import React from "react";
import OrderCloudSDK from "ordercloud-javascript-sdk";
import { RouteComponentProps } from "react-router";

interface OcListProps<O> extends RouteComponentProps<O> {
  service: any;
  routeParams?: string[];
}

interface OcListState<T> {
  data: T;
}

class OcList<O, T> extends React.Component<OcListProps<O>, OcListState<T>> {
  public componentDidMount = () => {
    this.requestList();
  };

  public requestList = () => {
    const { service, location, routeParams } = this.props;
    const qParams = new URLSearchParams(location.search);
    const rParams = routeParams || [];
    const options = {
      search: qParams.get("search"),
      page: qParams.get("page"),
      depth: qParams.get("depth"),
      pageSize: qParams.get("pageSize")
    };
    const requestArgs = [...rParams, options];
    service.List.apply(service, requestArgs).then((data: T) => {
      this.setState({ data });
    });
  };
}

export default OcList;
