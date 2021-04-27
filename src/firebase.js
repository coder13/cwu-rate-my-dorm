import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyA8A93K6mRFUIv7C1qOMffL0c46iQjkcrU',
  authDomain: 'cwu-rate-my-dorm.firebaseapp.com',
  projectId: 'cwu-rate-my-dorm',
  storageBucket: 'cwu-rate-my-dorm.appspot.com',
  messagingSenderId: '683058081928',
  appId: '1:683058081928:web:80f474f8c6f343f7e62f3d',
  measurementId: 'G-DH9FW3QQXF',
};

console.log('init');
firebase.initializeApp(firebaseConfig);

const provider = new firebase.auth.GoogleAuthProvider();

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

export const signInWithGoogle = () => {
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      firebase.auth().signInWithPopup(provider)
        .then((result) => {
          /** @type {firebase.auth.OAuthCredential} */
          console.log(result);
        }).catch((error) => {
          console.errr(error);
        });
    }).catch((err) => {
      console.error(err);
    });
  };

/* Stores user information in firebase */
export const generateUserDocument = async (user, additionalData) => {
  if (!user) {
    console.error('No user provided to save');
    return;
  };

  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { email, displayName, photoURL } = user;
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        ...additionalData
      });
    } catch (error) {
      console.error('Error creating user document', error);
    }
  }

  return getUserDocument(user.uid);
};

const getUserDocument = async uid => {
  if (!uid) return null;
  try {
    const userDocument = await firestore.doc(`users/${uid}`).get();
    return {
      uid,
      ...userDocument.data()
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }
};
