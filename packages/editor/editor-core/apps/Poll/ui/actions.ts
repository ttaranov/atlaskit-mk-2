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

export const initPoll = (props: { id: string }) => {
  return getPollVotes(props.id);
};

const getPollVotes = (id: string) => {
  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref('/polls/' + id)
      .once('value')
      .then(function(snapshot) {
        const array = snapshotToArray(snapshot);
        resolve(array);
      });
  });
};

export const vote = (props: { choiceId: string; userId: string }) => {
  const { userId, choiceId } = props;
  console.log('voting...');

  const pollName = 'indentation-poll'; // TODO change this to the vote id

  firebase
    .database()
    .ref('polls/' + pollName)
    .push({
      userId,
      choiceId,
    });
  return getPollVotes(pollName);
};
