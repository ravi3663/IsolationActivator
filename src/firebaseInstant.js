import RNFirebase from 'react-native-firebase';

const configurationOptions = {
  debug: true,
  persistence: true,
  // apiKey: "AIzaSyCVeJqATl0VQJn1caHWgMVUieCbemCbcjE",
  // databaseURL: "https://mi-isolation-b9f12.firebaseio.com",
  // projectId: "mi-isolation-b9f12",
  // storageBucket: "mi-isolation-b9f12.appspot.com",
  // messagingSenderId: "468779530255",
  // appId: "1:468779530255:web:b4acd70c2eed0e02a84b7a",
};

const firebase = RNFirebase.initializeApp(configurationOptions);
const FIRESTORE = firebase.firestore();
FIRESTORE.settings({ timestampsInSnapshots: true });
FIRESTORE.enablePersistence()
.catch(function(err) {
    if (err.code == 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled
        // in one tab at a a time.
        // ...
    } else if (err.code == 'unimplemented') {
        // The current browser does not support all of the
        // features required to enable persistence
        // ...
    }
});
// Subsequent queries will use persistence, if it was enabled successfully


const Analytics = firebase.analytics();
Analytics.setAnalyticsCollectionEnabled(true);

// dynamic link
const FBDYNAMICLINK = firebase.links();

//default values
const defaultFbRemoteConfig = () => {
  firebase
    .config()
    .setDefaults({
      enable_chat: '',
      enable_upgrade: ''
    });
};

export { firebase, Analytics, FIRESTORE, FBDYNAMICLINK, defaultFbRemoteConfig};
