import { firebase } from "../firebaseInstant";
import moment from 'moment';
import _ from 'lodash';

const DB = firebase.database();

console.log("DB", DB)
export const FIREBASE_USER = 'FIREBASE_USER'

export const setFirebaseUser = (payload) => (
    {
        type: FIREBASE_USER,
        payload
    }
)

export const listenToFirebaseUser = () => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            let firebaseId = getState().auth.user.firebaseid;
            let userRef = DB.ref(`users/${firebaseId}`);
            userRef.off('value');
            userRef.on('value', async(userSnapshot) => {
                let firebaseUser = userSnapshot.val();
                if (firebaseUser) {
                    dispatch(setFirebaseUser({user: firebaseUser}))
                    resolve(firebaseUser)
                }else{
                    dispatch(setFirebaseUser({user: null}))
                    resolve({});
                }
            })
        })
    }
}