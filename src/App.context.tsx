import React from "react";
import { MeUser, UserGroup } from "ordercloud-javascript-sdk";

export interface AppContextShape {
  token?: string | null;
  user?: MeUser | null;
  permissions?: string[] | null;
}

export const AppContext = React.createContext<AppContextShape>({});
