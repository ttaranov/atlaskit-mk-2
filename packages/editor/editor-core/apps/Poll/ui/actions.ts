import * as firebase from 'firebase';
function snapshotToArray(snapshot) {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
    let item = childSnapshot.val();
    // item.key = childSnapshot.key;
    // @ts-ignore
    returnArr.push(item);
  });

  console.log(`length of our new arrays is ${returnArr.length}`);
  return returnArr;
}

// @ts-ignore
// const snapshotToArray = snapshot => Object.entries(snapshot).map(e => Object.assign(e[1], { key: e[0] }));

// let VOTES = [
//   {
//     userId: '23123123123',
//     choiceId: '1',
//   },
//   {
//     userId: '44453564564',
//     choiceId: '2',
//   },
// ];

// Initialize Firebase
// TODO: Replace with your project's customized code snippet
var config = {
  apiKey: 'AIzaSyB-zSffLfq-lAq0FENVqNciRbr-dNEfV5g',
  authDomain: 'editor-apps-9ecc7.firebaseapp.com',
  databaseURL: 'https://editor-apps-9ecc7.firebaseio.com',
  projectId: 'editor-apps-9ecc7',
  storageBucket: 'editor-apps-9ecc7.appspot.com',
  messagingSenderId: '825651775699',
};
firebase.initializeApp(config);

const TIMEOUT = 300;

// fetching votes
export const initPoll = (props: { id: string }) => {
  // TODO: fetch poll by "id", create a new poll if "id" is undefined
  const pollName = 'indentation-poll'; // TODO change to pollID
  return getPollVotes(pollName);
  // return new Promise((resolve, reject) => {
  //   console.log('in initPoll');
  //   firebase.database().ref('/polls/' + pollName).once('value').then(function(snapshot) {
  //     console.log(snapshot.val())
  //     // const results = (snapshot.val() && snapshot.val());
  //     resolve({votes: snapshot.val()});
  //   });
  // });
};

const getPollVotes = (id: string) => {
  // console.log("getting database poll votes...");
  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref('/polls/' + id)
      .once('value')
      .then(function(snapshot) {
        // const rawOutput = snapshot

        const array = snapshotToArray(snapshot);
        console.log('getting values:', array);

        resolve(array);
      });
  });
};

export const vote = (props: { choiceId: string; userId: string }) => {
  const { userId, choiceId } = props;
  console.log('voting...');

  // VOTES = [...VOTES, { ...props }];
  const pollName = 'indentation-poll'; // TODO change this to the vote id

  firebase
    .database()
    .ref('polls/' + pollName)
    .push({
      userId,
      choiceId,
    });

  // newVoteRef.set({
  return getPollVotes(pollName);
  // return new Promise((resolve, reject) => {
  // resolve();
  // });
};
