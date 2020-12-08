/* eslint no-underscore-dangle: 0 */
import RNSecureKeyStore from "rn-secure-storage";
import moment from 'moment/src/moment';
import _ from 'lodash'
import { firebase } from './firebaseInstant';
import { dateTimestamp, dateTimestampWithTime, getDefaultNotificationTime, isArrayEqual, scheduleDailyActivityNotification } from './common';
import RNFetchBlob from 'rn-fetch-blob';

// FIREBASE DATABASE DECLARATION
const DB = firebase.database();
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
const XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;

// SET FIRST TIME USER OBJ
export const setUserFirstNameAndEmail = async (user) => {
  const userFbObj = await getUserObj();
  userFbObj.courseReminderSet = true;
  userFbObj.courseReminderTime = moment().unix(),
  userFbObj.courseReminderUpdated = false,
  userFbObj.firstName = user.firstname,
  userFbObj.lastName = "",
  userFbObj.organisationName = "",
  userFbObj.profile_path = "",
  userFbObj.timestamp = moment().unix(),
  userFbObj.userName = user.email,
  userFbObj.version = "v2.3"
  // Moved to Course Selection Action for notifications for api
  // userFbObj.courseReminderSet = true;
  // userFbObj.courseReminderTime = getDefaultNotificationTime()
  postUserObj(userFbObj)
  .then(() => {
    return true
  })
  .catch(e => console.log('UpdatingToken Error', e.toString()));
};


//GET USER FIREBASE ID
export const getUserFirebaseId = () => {
  return RNSecureKeyStore
    .get('user')
    .then((response) => {
      const user = JSON.parse(response);
      const userfirebaseid = user.firebaseid;
      return userfirebaseid;
    })
    .catch(err => {
      // console.log('Error', err.message);
      return err;
    });
};

// GET USER FIREBASE INSTANCE
export const getUserObj = () => {
  return getUserFirebaseId().then(userfirebaseid => {
    return DB
      .ref(`users/${userfirebaseid}`)
      .once('value')
      .then((snapshot) => {
        const userObj = snapshot.val();
        if (userObj === null) {
          DB.ref(`users/${userfirebaseid}`).set({});
          return {};
        }
        return userObj;
      })
      .catch(err => {
        // console.log('Error', err.message);
        return err;
      });
  });
};

// UPDATE USER FIREBASE INSTANCE
export const postUserObj = async (userObj) => {
  const updatedUserObj = userObj;
  console.log('updated user object to firebase', updatedUserObj);
  const userfirebaseid = await getUserFirebaseId();
  updatedUserObj.timestamp = moment().unix();
  console.log('updatedUserObj', updatedUserObj);
  DB.ref(`users/${userfirebaseid}`).set(updatedUserObj)
  .then(() => {
    console.log('ret',userObj);
    return userObj;
  });
  return Promise.resolve(userObj);
};

