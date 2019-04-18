import React from "react";
import { ListUser, ListCategory, Categories } from "ordercloud-javascript-sdk";
import OcList from "../Layout/OcList";

class AdminTools extends OcList<
  typeof Categories.List.arguments,
  ListCategory
> {
  public render() {
    console.log(typeof Categories.List.arguments);
    return (
      this.state && <pre>{JSON.stringify(this.state.data.Items, null, 2)}</pre>
    );
  }
}

export default AdminTools;
