import { List } from "@material-ui/core";
import CategoriesIcon from "@material-ui/icons/CategoryOutlined";
import CategoriesIconActive from "@material-ui/icons/CategoryTwoTone";
import EventsIcon from "@material-ui/icons/EventOutlined";
import EventsIconActive from "@material-ui/icons/EventTwoTone";
import ProductsIcon from "@material-ui/icons/LocalFloristOutlined";
import ProductsIconActive from "@material-ui/icons/LocalFloristTwoTone";
import DeliveryIcon from "@material-ui/icons/LocalShippingOutlined";
import DeliveryIconActive from "@material-ui/icons/LocalShippingTwoTone";
import SettingsIcon from "@material-ui/icons/LockOutlined";
import SettingsIconActive from "@material-ui/icons/LockTwoTone";
import CustomersIcon from "@material-ui/icons/PeopleOutlined";
import CustomersIconActive from "@material-ui/icons/PeopleTwoTone";
import OrdersIcon from "@material-ui/icons/ReceiptOutlined";
import OrdersIconActive from "@material-ui/icons/ReceiptTwoTone";
import MiscellaneousIcon from "@material-ui/icons/SettingsOutlined";
import MiscellaneousIconActive from "@material-ui/icons/SettingsTwoTone";
import ProfileIcon from "@material-ui/icons/AccountCircleOutlined";
import ProfileIconActive from "@material-ui/icons/AccountCircleTwoTone";
import React from "react";
import ListItemNavLink from "./ListItemNavLink";

const LeftDrawerContent: React.FunctionComponent = () => {
  return (
    <List>
      <ListItemNavLink
        to="/profile"
        primary="My Profile"
        icon={<ProfileIcon />}
        activeIcon={<ProfileIconActive />}
      />
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
};

export default LeftDrawerContent;