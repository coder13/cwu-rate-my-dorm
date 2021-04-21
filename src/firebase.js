import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA8A93K6mRFUIv7C1qOMffL0c46iQjkcrU',
  authDomain: 'cwu-rate-my-dorm.firebaseapp.com',
  projectId: 'cwu-rate-my-dorm',
  storageBucket: 'cwu-rate-my-dorm.appspot.com',
  messagingSenderId: '683058081928',
  appId: '1:683058081928:web:80f474f8c6f343f7e62f3d',
  measurementId: 'G-DH9FW3QQXF',
};

firebase.initializeApp(firebaseConfig);

const provider = new firebase.auth.GoogleAuthProvider();

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const signInWithGoogle = () => {
  auth.signInWithPopup(provider);
};
