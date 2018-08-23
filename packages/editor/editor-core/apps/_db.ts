import * as firebase from 'firebase';
export function snapshotToArray(snapshot) {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
    let item = childSnapshot.val();
    // item.key = childSnapshot.key;
    // @ts-ignore
    returnArr.push(item);
  });

  return returnArr;
}

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyB-zSffLfq-lAq0FENVqNciRbr-dNEfV5g',
  authDomain: 'editor-apps-9ecc7.firebaseapp.com',
  databaseURL: 'https://editor-apps-9ecc7.firebaseio.com',
  projectId: 'editor-apps-9ecc7',
  storageBucket: 'editor-apps-9ecc7.appspot.com',
  messagingSenderId: '825651775699',
};
firebase.initializeApp(config);

export const db = firebase;
