import React from "react";
import { List } from "@material-ui/core";
import ListItemNavLink from "./ListItemNavLink";

import OrdersIcon from "@material-ui/icons/ReceiptOutlined";
import OrdersIconActive from "@material-ui/icons/ReceiptTwoTone";

import CustomersIcon from "@material-ui/icons/PeopleOutlined";
import CustomersIconActive from "@material-ui/icons/PeopleTwoTone";

import CategoriesIcon from "@material-ui/icons/CategoryOutlined";
import CategoriesIconActive from "@material-ui/icons/CategoryTwoTone";

import ProductsIcon from "@material-ui/icons/LocalFloristOutlined";
import ProductsIconActive from "@material-ui/icons/LocalFloristTwoTone";

import EventsIcon from "@material-ui/icons/EventOutlined";
import EventsIconActive from "@material-ui/icons/EventTwoTone";

import DeliveryIcon from "@material-ui/icons/LocalShippingOutlined";
import DeliveryIconActive from "@material-ui/icons/LocalShippingTwoTone";

import MiscellaneousIcon from "@material-ui/icons/SettingsOutlined";
import MiscellaneousIconActive from "@material-ui/icons/SettingsTwoTone";

import SettingsIcon from "@material-ui/icons/LockOutlined";
import SettingsIconActive from "@material-ui/icons/LockTwoTone";

class LeftDrawerContent extends React.Component {
  public render() {
    return (
      <List>
        <ListItemNavLink
          to="/orders"
          primary="Orders"
          icon={<OrdersIcon />}
          activeIcon={<OrdersIconActive />}
        />
        <ListItemNavLink
          to="/customers"
          primary="Customers"
          icon={<CustomersIcon />}
          activeIcon={<CustomersIconActive />}
        />
        <ListItemNavLink
          to="/categories"
          primary="Categories"
          icon={<CategoriesIcon />}
          activeIcon={<CategoriesIconActive />}
        />
        <ListItemNavLink
          to="/products"
          primary="Products"
          icon={<ProductsIcon />}
          activeIcon={<ProductsIconActive />}
        />
        <ListItemNavLink
          to="/events"
          primary="Events"
          icon={<EventsIcon />}
          activeIcon={<EventsIconActive />}
        />
        <ListItemNavLink
          to="/delivery"
          primary="Delivery"
          icon={<DeliveryIcon />}
          activeIcon={<DeliveryIconActive />}
        />
        <ListItemNavLink
          to="/miscellaneous"
          primary="Miscellaneous"
          icon={<MiscellaneousIcon />}
          activeIcon={<MiscellaneousIconActive />}
        />
        <ListItemNavLink
          to="/admin"
          primary="Admin Tools"
          icon={<SettingsIcon />}
          activeIcon={<SettingsIconActive />}
        />
      </List>
    );
  }
}

export default LeftDrawerContent;
