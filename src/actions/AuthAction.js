import { Alert } from "react-native";
import { Actions } from "react-native-router-flux";
import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage'
import { firebase } from "../firebaseInstant";
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOADING,
  SIGN_USER,
  RESETAUTH
} from "./type";
import axiosInstant, { serialize } from "../axiosInstant";
import {
  apiUrl,
  fbAuthUrl
} from "../variable";
import { getUserObj, setUserFirstNameAndEmail } from "../fbCRUD";
import { storeProfileImage } from "../common";
// import { GsignOut, GsignIn } from "../components/social/googlesignin";
import { Store } from "../reducers";
import { listenToFirebaseUser } from "./FirebaseUser";
// import { subscribeToSubscriptionFirebaseTable } from "./userSubscriptionAction";

// export const loginUser = (userData) => {
//   const loginApi = `${apiUrl}authenticate/sign_in`;
//   return (dispatch) => {
//     dispatch({ type: LOADING, payload: true });
//     axiosInstant
//       .post(loginApi, userData)
//       .then(user => {
//         // amplitude.setUserId(user.data.data.firebaseid);
//         amplitude.setUserId(user.data.data.firebase_id);
//         dispatch({type: LOGIN_SUCCESS, payload: user.data.data});
//         RNSecureKeyStore
//           .set('user', JSON.stringify(user.data.data))
//           .then((res) => {
//           }, (err) => {
//           });
//       })
//       .catch(err => {
//         dispatch({ type: LOGIN_FAIL, payload: error });
//         const message = error.response.data.errors[0];
//         Alert.alert(
//           'Login Error',
//           message,
//           [
//             { text: 'OK' },
//           ]
//         );
//         // Actions.login();
//       })
//   }
// }

// export const googleSignIn = () => {
//   return async dispatch => {
//     await GsignOut();
//     let response = await GsignIn();
//     if (response.status && response.userInfo) {
//       dispatch({ type: LOADING, payload: true });
//       let data = {
//         ...response.userInfo,
//         code: response.userInfo.serverAuthCode,
//         ...defaultNetworkData
//       };
//       data = serialize(data);

//       axiosInstant
//         .post(gAuthUrl, data, {
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
//           }
//         })
//         .then(second_response => {
//           socialSignUpSuccess(dispatch, second_response.data.user);
//         })
//         .catch(err => {
//           signupFailure(dispatch, err, "googlesignup");
//         });
//     }
//   };
// };

export const fbLogin = response => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      dispatch({ type: LOADING, payload: true });
      let data = { ...response };
      axiosInstant
        .post(fbAuthUrl, data, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(userData => {
          let user = userData.data.user;
          socialSignUpSuccess(dispatch, user);
          resolve(user);
        })
        .catch(error => {
          let authError = socialFailure(dispatch, error, "fbLogin");
          reject(authError);
        });
    });
  };
};

export const login = data => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      dispatch({ type: LOADING, payload: true });
      const loginApi = `${apiUrl}authenticate/sign_in`;
      axiosInstant
        .post(loginApi, data)
        .then(response => {
          const user = response.data.data;
          const firebaseId = user.firebaseid;
          // storeUser(user);
          storeUser(user);
          console.log('checking user', user);
          storeProfileImage(user.image);
          // firbaseSignUp(user, false);
          dispatch({ type: LOGIN_SUCCESS, payload: user });
          resolve(user);
          console.log(user, 'checking the user on auth action');
        })
        .catch(error => {
          dispatch({ type: LOGIN_FAIL, payload: error });
          const message = error.response.data.errors[0];
          Alert.alert("Login Error", message, [{ text: "OK" }]);
          reject(error);
        });
    });
  };
};

const storeUser = (user) => {
  // STORING ARTICLE INFORAMATION TO
  RNSecureStorage.set("user", JSON.stringify(user), {accessible: ACCESSIBLE.WHEN_UNLOCKED})
  .then((res) => {
    console.log(res);
  }, (err) => {
    console.log(err);
  });
};

// const storeUser = user => {

//   RNSecureKeyStore.set("user", JSON.stringify(user)).then(
//     res => {
//       console.log(res); // key stored successfully
//     },
//     err => {}
//   );
// };

const signupSuccess = async (dispatch, user) => {
  dispatch({ type: SIGN_USER, payload: user });
  RNSecureKeyStore.set("user", JSON.stringify(user)).then(
    res => {
      storeProfileImage(user.image);
      getUserObj().then(userObj => {
        if (!userObj.firstName) {
          setUserFirstNameAndEmail(user);
        }
      });
      Actions.welcome();
    },
    err => {}
  );
};

const signupFailure = async (dispatch, err, functionName) => {
  console.log(err.response);
  dispatch({ type: LOADING, payload: false });
  let message,
    func = () => void 0;
  if (err.response.status === 300 && functionName === "signup") {
    message = err.response.data.errors[0];
    func = () => Actions.login();
  } else if (functionName === "googlesignup" || functionName === "fbLogin") {
    if (err.response.status === 300) {
      message = err.response.data.errors[0];
      func = () => Actions.login({ email: err.response.data.data.email });
    } else if (err.response.status === 401) {
      message = err.response.data.errors[0];
    }
  } else {
    message = err.response.data.errors.full_messages[0];
  }
  Alert.alert("Signup Error", message, [{ text: "OK", onPress: func }]);
};

const socialSignUpSuccess = async (dispatch, user) => {
  dispatch({ type: SIGN_USER, payload: user });
  RNSecureKeyStore.set("user", JSON.stringify(user)).then(
    res => {
      storeProfileImage(user.image);
      getUserObj().then(userObj => {
        if (userObj.currentCourseName) {
          Actions.push("dashboard");
        } else {
          Actions.push("welcome");
        }
      });
    },
    err => {}
  );
};

const socialFailure = (dispatch, err, functionName) => {
  let returnVal = {};
  dispatch({ type: LOADING, payload: false });
  if (err.response) {
    console.log("err", err.response);
    const errorResponse = err.response;
    console.log("errorResponse", errorResponse, errorResponse.status);
    if (errorResponse.status === 422) {
      returnVal = {
        error: errorResponse.data.errors.full_messages[0],
        errorResponse
      };
    } else {
      if (errorResponse.status === 300) {
        Alert.alert("", errorResponse.data.errors[0], [
          {
            text: "OK",
            onPress: () =>
              Actions.login({ email: err.response.data.data.email })
          }
        ]);
      }
      if (errorResponse.status === 401) {
        Alert.alert("", errorResponse.data.errors[0], [
          { text: "OK", onPress: () => void 0 }
        ]);
      }
    }
  } else {
    Alert.alert("", "Please connect to internet and try again!", [
      { text: "OK", onPress: () => void 0 }
    ]);
  }
  console.log("retunVal", returnVal);
  return returnVal;
};

export const signup = userData => {
  const signupUrl = `${apiUrl}authenticate`;
  return dispatch => {
    return new Promise((resolve, reject) => {
      dispatch({ type: LOADING, payload: true });
      //Fail Safe
      setTimeout(() => {
        dispatch({ type: LOADING, payload: false });
      }, 15000);
      axiosInstant
        .post(signupUrl, userData, { headers: { "Create-Firebase": "false" } })
        .then(userResponse => {
          let user = userResponse.data.data;
          signupSuccess(dispatch, user);
          resolve(user);
          // dispatch({ type: SIGN_USER, payload: user });
          // RNSecureKeyStore
          // .set('user', JSON.stringify(user))
          // .then((res) => {
          //   storeProfileImage(user.image);
          //   firbaseSignUp(user);
          // }, (err) => {
          // })
        })
        .catch(err => {
          signupFailure(dispatch, err, "signup");
          reject(err);
          // dispatch({ type: LOADING, payload: false });
          // const message = err.response.data.errors.full_messages[0];
          // Alert.alert(
          //   'Signup Error',
          //   message,
          //   [
          //     { text: 'OK' },
          //   ]
          // );
        });
    });
  };
};

export const resetAuth = () => {
  return {
    type: RESETAUTH
  };
};

export const handleLoginRouting = () => {
  getUserObj()
    .then(res => {
        //  new app user Dashboard flow
        Actions.appLoading();
        // Actions.testing();
        // Actions.OnboardingAssessmentGraph({ course: 'sleep'});
        // Actions.onboardingPersonalisedPlan({ course: 'sleep'});
        // Actions.calculatingScore({ course: 'sleep'});
        // Actions.startAssessment({ course: 'sleep' });
        // Actions.sleepAudioActivity({ course: 'sleep' });
        // Actions.stepOne();
        // Actions.userDashboard();
        // Actions.reactAudioPlayer();
    })
    .catch(err => {
      console.log("hetsuerobj", err);
    });
};