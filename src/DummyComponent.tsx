import React from "react";

interface OrderListProps {
  match: any;
}

export class Orders extends React.Component<OrderListProps> {
  public render() {
    const filter = this.props.match.path;
    return <h1>{filter}</h1>;
  }
}
export class BuildOrder extends React.Component {
  public render() {
    return "Build Order";
  }
}

export default class DummyComponent extends React.Component<{ match: any }> {
  public render() {
    return <pre>{JSON.stringify(this.props.match, null, 2)}</pre>;
  }
}
