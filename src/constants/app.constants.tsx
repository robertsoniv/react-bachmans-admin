import { ApiRole } from "ordercloud-javascript-sdk";

export const client_id =
  process.env.NODE_ENV === "development"
    ? "235BCCA4-1A31-41DC-8579-F6B217491067"
    : "892EDAD3-70D9-46A3-A630-E749D81B0963";

export const purple_perks_url = `https://Four51TRIAL104401.jitterbit.net/${
  process.env.NODE_ENV === "development"
    ? "Test_BachmansOnPrem"
    : "BachmansOnPrem"
}/PurplePerksBalanceCheck`;

export const scope: ApiRole[] = [
  "AddressAdmin",
  "AddressReader",
  "AdminAddressReader",
  "AdminUserAdmin",
  "AdminUserGroupAdmin",
  "AdminUserGroupReader",
  "AdminUserReader",
  "ApprovalRuleAdmin",
  "ApprovalRuleReader",
  "BuyerAdmin",
  "BuyerImpersonation",
  "BuyerReader",
  "BuyerUserAdmin",
  "BuyerUserReader",
  "CatalogAdmin",
  "CatalogReader",
  "CategoryAdmin",
  "CategoryReader",
  "CostCenterAdmin",
  "CostCenterReader",
  "CreditCardAdmin",
  "CreditCardReader",
  "FullAccess",
  "InventoryAdmin",
  "MeAddressAdmin",
  "MeAdmin",
  "MeCreditCardAdmin",
  "MessageConfigAssignmentAdmin",
  "MeXpAdmin",
  "OrderAdmin",
  "OrderReader",
  "OverrideShipping",
  "OverrideTax",
  "OverrideUnitPrice",
  "PasswordReset",
  "PriceScheduleAdmin",
  "PriceScheduleReader",
  "ProductAdmin",
  "ProductAssignmentAdmin",
  "ProductReader",
  "PromotionAdmin",
  "PromotionReader",
  "SetSecurityProfile",
  "ShipmentAdmin",
  "ShipmentReader",
  "Shopper",
  "SpendingAccountAdmin",
  "SpendingAccountReader",
  "SupplierAddressReader",
  "SupplierUserGroupReader",
  "UnsubmittedOrderReader",
  "UserGroupAdmin",
  "UserGroupReader"
];
