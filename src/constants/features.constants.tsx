import { ApiRole } from "ordercloud-javascript-sdk";

export interface AppFeature {
  id: string;
  name: string;
  roles: ApiRole[];
}

export const ORDER_FEATURES: AppFeature[] = [
  {
    id: "ORDER_READER",
    name: "View Orders",
    roles: ["OrderReader", "ShipmentReader", "UnsubmittedOrderReader"]
  },
  {
    id: "ORDER_RESUBMIT",
    name: "Resubmit Orders",
    roles: ["OrderAdmin", "ShipmentAdmin"]
  },
  {
    id: "ORDER_CREATE",
    name: "Build Orders",
    roles: ["OrderAdmin", "BuyerUserAdmin", "BuyerImpersonation"]
  }
];

export const INTERNAL_USER_FEATURES: AppFeature[] = [
  {
    id: "INTERNAL_USER_READER",
    name: "View Internal Users",
    roles: ["AdminUserReader", "AdminUserGroupReader"]
  },
  {
    id: "INTERNAL_USER_ADMIN",
    name: "Manage Internal Users",
    roles: ["AdminUserAdmin", "AdminUserGroupAdmin"]
  },
  {
    id: "INTERNAL_USER_BULK",
    name: "Bulk Internal User Actions",
    roles: ["AdminUserAdmin", "AdminUserGroupAdmin"]
  }
];

export const CUSTOMER_FEATURES: AppFeature[] = [
  {
    id: "CUSTOMER_READER",
    name: "View Customers",
    roles: [
      "BuyerUserReader",
      "AddressReader",
      "CreditCardReader",
      "BuyerReader",
      "UserGroupReader"
    ]
  },
  {
    id: "CUSTOMER_ADMIN",
    name: "View Customers",
    roles: [
      "BuyerUserAdmin",
      "AddressAdmin",
      "CreditCardAdmin",
      "BuyerReader",
      "UserGroupAdmin"
    ]
  },
  {
    id: "CUSTOMER_EMAIL",
    name: "Modify Customer Emails",
    roles: ["BuyerUserAdmin"]
  },
  {
    id: "CUSTOMER_RESUBMIT",
    name: "Resubmit Customer to Eagle",
    roles: ["BuyerUserAdmin"]
  },
  {
    id: "CUSTOMER_BULK",
    name: "Bulk Customer Actions",
    roles: [
      "BuyerUserAdmin",
      "AddressAdmin",
      "CreditCardAdmin",
      "BuyerReader",
      "UserGroupAdmin"
    ]
  }
];

const AVAILABLE_FEATURES = {
  ORDERS: ORDER_FEATURES,
  INTERNAL_USERS: INTERNAL_USER_FEATURES,
  CUSTOMERS: CUSTOMER_FEATURES
};

export default AVAILABLE_FEATURES;
