import { NavigationProp } from "@react-navigation/native";

export type AuthParamlist = {
  Login: undefined;
  Register: undefined;
};

export type AuthScreenNavigationProp<
  Screen extends keyof AuthParamlist
> = NavigationProp<AuthParamlist, Screen>; //
