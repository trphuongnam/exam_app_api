import store from "@/app/stores/store";
import { loginAction } from "@/app/stores/action/login";

export const authenticationRouter = (cookies: any) => {
  const tokenData = cookies.get("token");
  if (tokenData) {
    if ( Date.now() > tokenData.exp) {
      return false;
    } else {
      store.dispatch(loginAction(true));
      return true;
    }
  } else {
    return false;
  }
}


