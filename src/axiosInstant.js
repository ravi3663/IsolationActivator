import axios from 'axios';
import RNSecureStorage from "rn-secure-storage";
import _ from 'lodash';
import { tokenKey } from './variable';
const qs = require('qs')

// Variable store the token values for faster access
let tokenHeaders;

//Serialize the data for network call
export const serialize = (obj) => {
  return qs.stringify(obj);
}

// Axios Default configurations
const defaultConfig = {
  timeout: 30000,
  // transformRequest: [transformAxiosRequest],
  // headers: {...defaultHeaders}
}

// Default Headers which needs to be sent in all requests.
const defaultHeaders = {
  common: {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=UTF-8'
  }
}

export const extraHeadersSignup = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Create-Firebase': "false"
  }
}

export const extraHeadersLogin = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  }
}

// This is a small helper function which stringifies the data sent to api if not done as calling source
const transformAxiosRequest = (data) => {
    let requestData = {...data};
    if(requestData && !_.isString(requestData)){
      requestData = JSON.stringify(requestData);
    }
    return requestData;
}

export const getUserAuthTokenFromSecureStore = () => {
  return new Promise((resolve, reject) => {
    RNSecureStorage.get(tokenKey).then(response => {
      resolve(response)
    }, err => {
      reject(err);
    })
  })
}

const removeUserFromSecureStorage = () => {
  return new Promise((resolve, reject) => {
    RNSecureStorage.remove('user')
      .then((res => {
        resolve(res)
      }), (err) => console.log(err))
      resolve(r);
    }, (err) => {
        reject(err);
    });
}

const removeAuthTokensFromSecureStore = () => {
  return new Promise((resolve, reject) => {
    RNSecureStorage.remove(tokenKey)
    .then((r) => {
      RNSecureStorage.remove('user')
      .then((res => {
        resolve(res)
      }), (err) => console.log(err))
      resolve(r);
    }, (err) => {
        reject(err);
    });
  })
}

// Sets the authentication headers on each request.
// value would be taken if present in the local variable else will take from RNSecureKeyStore
const setTokenHeadersOnRequest = async(config) => {
  let requestConfig = {...config};
  let versionHeader = {
    "Ios-Version": "1"
  }
  let requestHeader = {...config.headers, ...versionHeader};
  let authHeader = {};
  if (tokenHeaders) {
    authHeader = {...tokenHeaders}
  }else{
    let storeAuthTokensString = await getUserAuthTokenFromSecureStore()
    .catch((err) => {
    });
    if (storeAuthTokensString) {
      let storeAuthTokens = JSON.parse(storeAuthTokensString);
      if (storeAuthTokens && storeAuthTokens['access-token']) {
        authHeader = {...storeAuthTokens};
      }
    }
  }
  if (authHeader) {
    requestHeader = {...requestHeader, ...authHeader};
    requestConfig.headers = {...requestHeader};
  }

  return requestConfig;
}

const requestInterceptorError = (error) => {
  return Promise.reject(error);
}

// Store the authentication headers in local variable and RNSecureKeyStore for in case the applicattion closes
const storeTokenHeadersOfResponse = async(response) => {
  let responseHeader = {...response.headers};
  console.log('checking response header', responseHeader);
  if (responseHeader && responseHeader['access-token']) {
    let {expiry, uid, client} = responseHeader;
    let accessToken = responseHeader['access-token'];
    if (expiry && uid && client && accessToken) {
      tokenHeaders = {expiry, uid, client}
      tokenHeaders['access-token'] = accessToken;
      // await storeAuthTokensToSecureStore(tokenHeaders).catch(err => {})
    } else {
    }
  }
  return response;
}

const responseInterceptorError = (error) => {
  return new Promise((resolve, reject) => {
    if (error.response && error.response.status === 401) {
      removeAuthTokensFromSecureStore()
        .catch(err => {
        })
    } else if(error.response && error.response.status === 300) {
    }
    console.log("axios error", error);
    reject(error);
  })
}

const axiosInstant = axios.create({...defaultConfig});

axiosInstant.interceptors.request.use(setTokenHeadersOnRequest, requestInterceptorError)
axiosInstant.interceptors.response.use(storeTokenHeadersOfResponse, responseInterceptorError)

export default axiosInstant;
// import axios from 'axios';

// const axiosInstance = axios.create({
//   timeout: 30000,
// });


// let configHeaders;


// axiosInstance.interceptors.request.use((config) => {
//   if (configHeaders) {
//     config.headers = { ...config.headers,
//      'access-token': configHeaders['access-token'],
//       client: configHeaders.client,
//       expiry: configHeaders.expiry,
//       'Content-Type': 'application/json; charset=UTF-8',
//       uid: configHeaders.uid
//     };
//   } else {
//     config.headers = {
//       Accept: 'application/json',
//       'Content-Type': 'application/json; charset=UTF-8'
//     };
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });


// // Add a response interceptor
// axiosInstance.interceptors.response.use((response) => {
//   if (response.headers['access-token'] !== undefined) {
// 		configHeaders = response.headers;
//   }
//   return response;
// }, (error) => {
//   return Promise.reject(error);
// });

// export default axiosInstance;
export { removeAuthTokensFromSecureStore, removeUserFromSecureStorage };