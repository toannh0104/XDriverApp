import { AsyncStorage } from "react-native";

export const USER_KEY = "auth-demo-key";

export const onSignIn = () => AsyncStorage.setItem("@spt:userid", "true");

export const onSignOut = () => {
  // AsyncStorage.setItem(USER_SIGNED_IN, "false");
  AsyncStorage.removeItem("@spt:userid")
};


export const isSignedIn = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem("@spt:userid")
      .then(res => {
        if (res !== null) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
  });
};