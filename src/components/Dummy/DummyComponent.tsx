import React from "react";

export default class DummyComponent extends React.Component<{ match: any }> {
  public render() {
    return <pre>{JSON.stringify(this.props.match, null, 2)}</pre>;
  }
}
