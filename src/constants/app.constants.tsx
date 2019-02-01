import { ApiRole } from "ordercloud-javascript-sdk";
export const client_id =
  process.env.NODE_ENV === "development"
    ? "235BCCA4-1A31-41DC-8579-F6B217491067"
    : "892EDAD3-70D9-46A3-A630-E749D81B0963";
export const scope: ApiRole[] = ["FullAccess"];
